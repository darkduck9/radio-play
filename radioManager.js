import { defaultRadioStations, getRadio, saveOrder } from './radioinfo.js';

const STATION_PAGE_SIZES = [9, 12, 15, 18, 21];

function openRadioDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('RadioDB', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('radioStations')) {
                db.createObjectStore('radioStations', { keyPath: 'id' });
            }
        };
    });
}

export async function saveRadioStation(station) {
    if (!station?.params?.id || !station.name) {
        throw new Error('电台名称和ID不能为空');
    }

    const db = await openRadioDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('radioStations', 'readwrite');
        transaction.oncomplete = () => {
            db.close();
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'radio-station-saved',
                    id: String(station.params.id)
                }, window.location.origin);
            }
            resolve(station);
        };
        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };
        transaction.onabort = () => {
            db.close();
            reject(transaction.error);
        };
        transaction.objectStore('radioStations').put({
            ...station,
            params: {
                ...station.params,
                mark: station.params.mark ?? 1
            },
            id: String(station.params.id)
        });
    });
}

async function getSavedRadioStations() {
    const db = await openRadioDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('radioStations', 'readonly');
        const request = transaction.objectStore('radioStations').getAll();
        request.onsuccess = () => {
            db.close();
            resolve(request.result);
        };
        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
}

async function deleteSavedRadioStation(stationId) {
    const db = await openRadioDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('radioStations', 'readwrite');
        transaction.objectStore('radioStations').delete(String(stationId));
        transaction.oncomplete = () => {
            db.close();
            resolve();
        };
        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };
        transaction.onabort = () => {
            db.close();
            reject(transaction.error);
        };
    });
}

function getDeletableStationIds(savedStations) {
    const defaultIds = new Set(defaultRadioStations.map(station => String(station.params.id)));
    return new Set(
        savedStations
            .map(station => String(station.params?.id ?? station.id))
            .filter(id => id && !defaultIds.has(id))
    );
}

class RadioManager {
    constructor() {
        this.radioStations = getRadio();
        const savedStationsPerPage = Number(localStorage.getItem('stationsPerPage'));
        this.stationsPerPage = STATION_PAGE_SIZES.includes(savedStationsPerPage)
            ? savedStationsPerPage
            : 9;
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.radioStations.length / this.stationsPerPage);
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.isReady = false;
        this.pendingStationId = null;
        this.savedStationIds = new Set();
        this.showAllPages = false;
        this.paginationLongPressTimer = null;
        this.ignoreNextPaginationClick = false;
        window.addEventListener('radio-station-saved', (event) => {
            if (!event.detail?.id) return;
            if (this.isReady) {
                this.refreshRadioStations(event.detail.id);
            } else {
                this.pendingStationId = event.detail.id;
            }
        });
        this.init();
    }

    async init() {
        try {
            const savedStations = await getSavedRadioStations();
            this.savedStationIds = getDeletableStationIds(savedStations);
            this.radioStations = getRadio(savedStations);
        } catch (error) {
            console.error('读取已添加电台失败:', error);
        }
        this.totalPages = Math.ceil(this.radioStations.length / this.stationsPerPage);
        const savedPage = Number.parseInt(localStorage.getItem('lastViewedPage'), 10);
        this.currentPage = Number.isNaN(savedPage)
            ? 1
            : Math.min(Math.max(savedPage, 1), Math.max(this.totalPages, 1));
        this.createPages();
        this.initContextMenu();
        this.initTouchEvents();
        this.initMouseEvents();
        this.createPaginationIndicator();
        if (this.totalPages > 0) {
            this.changePage(this.currentPage);
        }
        this.isReady = true;
        if (this.pendingStationId) {
            this.refreshRadioStations(this.pendingStationId);
            this.pendingStationId = null;
        }
    }

    async refreshRadioStations(stationId) {
        try {
            const savedStations = await getSavedRadioStations();
            this.savedStationIds = getDeletableStationIds(savedStations);
            this.radioStations = getRadio(savedStations);
            this.totalPages = Math.ceil(this.radioStations.length / this.stationsPerPage);

            const stationIndex = this.radioStations.findIndex(
                station => String(station.params.id) === String(stationId)
            );
            this.currentPage = stationIndex >= 0
                ? Math.floor(stationIndex / this.stationsPerPage) + 1
                : 1;

            this.createPages();
            this.createPaginationIndicator();
            if (this.currentPage > 1) {
                this.changePage(this.currentPage);
            }
        } catch (error) {
            console.error('刷新电台列表失败:', error);
        }
    }

    initContextMenu() {
        const container = document.getElementById('radio-container');
        
        // 创建右键菜单
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.display = 'none';
        contextMenu.style.position = 'fixed';
        contextMenu.style.zIndex = '1000';
        contextMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        contextMenu.style.borderRadius = '8px';
        contextMenu.style.padding = '8px 0';
        contextMenu.style.minWidth = '150px';
        contextMenu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        contextMenu.innerHTML = `
            <div class="context-menu-item" id="sort-stations" style="padding: 8px 16px; color: #fff; cursor: pointer; transition: background-color 0.2s;">调整电台顺序</div>
        `;
        document.body.appendChild(contextMenu);

        let longPressTimer = null;
        let startX = 0;
        let startY = 0;
        let longPressOnStation = false;
        let ignoreNextDismissClick = false;

        const showContextMenu = (clientX, clientY, suppressStationPlayback = false) => {
            contextMenu.style.display = 'block';
            const rect = contextMenu.getBoundingClientRect();
            const left = Math.max(0, Math.min(clientX, window.innerWidth - rect.width));
            const top = Math.max(0, Math.min(clientY, window.innerHeight - rect.height));
            contextMenu.style.left = `${left}px`;
            contextMenu.style.top = `${top}px`;
            if (suppressStationPlayback) this.ignoreNextRadioClick = true;
        };

        const clearLongPress = () => {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        };

        // 添加右键菜单事件
        container.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            showContextMenu(event.clientX, event.clientY);
        });

        container.addEventListener('pointerdown', (event) => {
            if (event.pointerType !== 'touch' || event.target.closest('.pagination')) return;
            clearLongPress();
            startX = event.clientX;
            startY = event.clientY;
            longPressOnStation = Boolean(event.target.closest('.radio-button'));
            longPressTimer = setTimeout(() => {
                ignoreNextDismissClick = true;
                showContextMenu(startX, startY, longPressOnStation);
            }, 600);
        });

        document.addEventListener('pointermove', (event) => {
            if (!longPressTimer) return;
            if (Math.abs(event.clientX - startX) > 10 || Math.abs(event.clientY - startY) > 10) {
                clearLongPress();
            }
        });

        document.addEventListener('pointerup', () => {
            clearLongPress();
            setTimeout(() => {
                ignoreNextDismissClick = false;
            }, 0);
        });
        document.addEventListener('pointercancel', clearLongPress);

        // 点击其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (ignoreNextDismissClick) {
                ignoreNextDismissClick = false;
                return;
            }
            if (!contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
        });

        // 添加排序选项点击事件
        document.getElementById('sort-stations').addEventListener('click', () => {
            contextMenu.style.display = 'none';
            this.showSortingInterface();
        });
    }

    showSortingInterface() {
        const self = this; // 保存this引用
        // 创建排序界面
        const sortingModal = document.createElement('div');
        sortingModal.className = 'sorting-modal';

        const sortingContainer = document.createElement('div');
        sortingContainer.className = 'sorting-container';

        const sortingHeader = document.createElement('div');
        sortingHeader.className = 'sorting-header';

        // 添加每页显示数量设置
        const pageSizeControl = document.createElement('div');
        pageSizeControl.className = 'sorting-page-size';
        pageSizeControl.innerHTML = `
            <span>每页显示</span>
            <select id="pageSizeSelect">
                ${STATION_PAGE_SIZES.map(size => `<option value="${size}">${size}个</option>`).join('')}
            </select>
        `;

        sortingHeader.innerHTML = `
            <h2>调整电台顺序</h2>
            <div class="sorting-header-controls">
                ${pageSizeControl.outerHTML}
                <button class="close-btn" type="button" aria-label="关闭">&times;</button>
            </div>
        `;

        const sortingContent = document.createElement('div');
        sortingContent.className = 'sorting-content';

        // 创建分页容器
        const pagesContainer = document.createElement('div');
        pagesContainer.className = 'sorting-pages';

        // 创建分页指示器
        const paginationIndicator = document.createElement('div');
        paginationIndicator.className = 'sorting-pagination';

        // 初始化分页
        let currentPageSize = self.stationsPerPage;
        let currentPage = 1;
        let totalPages = Math.ceil(self.radioStations.length / currentPageSize);

        function updatePages() {
            pagesContainer.innerHTML = '';
            paginationIndicator.innerHTML = '';

            // 创建分页
            for (let i = 1; i <= totalPages; i++) {
                const page = document.createElement('div');
                page.className = 'sorting-page';

                // 添加分页标题
                const pageHeader = document.createElement('div');
                pageHeader.className = 'sorting-page-header';
                pageHeader.textContent = `第 ${i} 页`;
                page.appendChild(pageHeader);

                // 获取当前页的电台
                const startIndex = (i - 1) * currentPageSize;
                const endIndex = Math.min(startIndex + currentPageSize, self.radioStations.length);
                const pageStations = self.radioStations.slice(startIndex, endIndex);

                // 添加电台到页面
                pageStations.forEach(station => {
                    const stationElement = document.createElement('div');
                    stationElement.className = 'sorting-station';
                    stationElement.innerHTML = `
                        <img src="${station.icon}" alt="${station.name}">
                        <span>${station.name}</span>
                    `;
                    stationElement.setAttribute('data-station-id', station.params.id);
                    page.appendChild(stationElement);
                });

                pagesContainer.appendChild(page);
            }

            // 初始化拖拽排序
            new window.Sortable(pagesContainer, {
                animation: 150,
                ghostClass: 'sorting-ghost',
                draggable: '.sorting-station',
                group: 'stations',
                onEnd: function(evt) {
                    // 更新电台顺序
                    const newOrder = [];
                    pagesContainer.querySelectorAll('.sorting-station').forEach(station => {
                        newOrder.push(station.getAttribute('data-station-id'));
                    });
                    self.radioStations = newOrder.map(id => 
                        self.radioStations.find(station => station.params.id === id)
                    );
                }
            });

            // 为每个页面单独初始化Sortable
            pagesContainer.querySelectorAll('.sorting-page').forEach(page => {
                new window.Sortable(page, {
                    animation: 150,
                    ghostClass: 'sorting-ghost',
                    group: 'stations',
                    onEnd: function(evt) {
                        // 更新电台顺序
                        const newOrder = [];
                        pagesContainer.querySelectorAll('.sorting-station').forEach(station => {
                            newOrder.push(station.getAttribute('data-station-id'));
                        });
                        self.radioStations = newOrder.map(id => 
                            self.radioStations.find(station => station.params.id === id)
                        );
                    }
                });
            });
        }

        updatePages();

        const sortingFooter = document.createElement('div');
        sortingFooter.className = 'sorting-footer';
        sortingFooter.innerHTML = `
            <button class="cancel-btn" type="button">取消</button>
            <button class="save-btn" type="button">保存</button>
        `;

        sortingContent.appendChild(pagesContainer);
        sortingContent.appendChild(paginationIndicator);
        sortingContainer.appendChild(sortingHeader);
        sortingContainer.appendChild(sortingContent);
        sortingContainer.appendChild(sortingFooter);
        sortingModal.appendChild(sortingContainer);
        document.body.appendChild(sortingModal);
        sortingModal.querySelector('#pageSizeSelect').value = String(currentPageSize);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => sortingModal.classList.add('is-open'));
        });

        let isClosing = false;
        let closeTimer = null;
        const closeSortingModal = () => {
            if (isClosing) return;
            isClosing = true;
            sortingModal.classList.remove('is-open');
            document.removeEventListener('keydown', escHandler);

            const removeModal = () => {
                window.clearTimeout(closeTimer);
                sortingModal.remove();
            };
            sortingModal.addEventListener('transitionend', (event) => {
                if (event.target === sortingModal && event.propertyName === 'opacity') {
                    removeModal();
                }
            }, { once: true });
            closeTimer = window.setTimeout(removeModal, 220);
        };

        function escHandler(event) {
            if (event.key === 'Escape') closeSortingModal();
        }

        // 添加每页显示数量变化事件
        document.getElementById('pageSizeSelect').addEventListener('change', (e) => {
            currentPageSize = parseInt(e.target.value);
            currentPage = 1;
            totalPages = Math.ceil(self.radioStations.length / currentPageSize);
            updatePages();
        });

        // 添加关闭按钮事件
        sortingModal.querySelector('.close-btn').addEventListener('click', () => {
            closeSortingModal();
        });

        // 添加取消按钮事件
        sortingModal.querySelector('.cancel-btn').addEventListener('click', () => {
            closeSortingModal();
        });

        // 添加保存按钮事件
        sortingModal.querySelector('.save-btn').addEventListener('click', async () => {
            const newOrder = [];
            const idSet = new Set();
            const duplicateIds = new Set();
            
            // 检查重复ID
            pagesContainer.querySelectorAll('.sorting-station').forEach(station => {
                const id = station.getAttribute('data-station-id');
                if (idSet.has(id)) {
                    duplicateIds.add(id);
                }
                idSet.add(id);
                newOrder.push(id);
            });

            // 如果有重复ID，显示错误提示
            if (duplicateIds.size > 0) {
                const duplicateStations = Array.from(duplicateIds).map(id => {
                    const station = self.radioStations.find(s => s.params.id === id);
                    return station ? station.name : id;
                });

                // 创建错误提示模态框
                const errorModal = document.createElement('div');
                errorModal.className = 'sorting-error-modal';

                errorModal.innerHTML = `
                    <h3 class="sorting-error-title">无法保存：存在重复的电台ID</h3>
                    <p>以下电台的ID重复，请修改后再保存：</p>
                    <ul class="sorting-error-list">
                        ${duplicateStations.map(name => `<li>${name}</li>`).join('')}
                    </ul>
                    <p>请修改电台ID后再尝试保存。</p>
                    <button class="sorting-error-close" type="button">确定</button>
                `;

                // 添加确定按钮事件
                errorModal.querySelector('button').addEventListener('click', () => {
                    errorModal.remove();
                });

                document.body.appendChild(errorModal);
                return;
            }

            // 如果没有重复ID，继续保存
            saveOrder(newOrder);
            self.radioStations = getRadio(await getSavedRadioStations());
            self.stationsPerPage = currentPageSize;
            localStorage.setItem('stationsPerPage', String(currentPageSize));
            self.recreatePages();
            closeSortingModal();
        });

        // 添加ESC键关闭
        document.addEventListener('keydown', escHandler);

    }

    initMouseEvents() {
        const container = document.getElementById('radio-container');
        
        // 仅在左键按下时开始拖动，避免右键/中键触发
        container.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // 0 = 左键
            this.isDragging = true;
            this.touchStartX = e.clientX;
            this.touchEndX = e.clientX; // 初始化，防止未移动时误判
        });

        container.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.touchEndX = e.clientX;
        });

        container.addEventListener('mouseup', (e) => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.touchEndX = e.clientX; // 确保结束位置被更新
            this.handleSwipe();
        });

        container.addEventListener('mouseleave', (e) => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.touchEndX = e.clientX || this.touchStartX; // 保底处理
            this.handleSwipe();
        });

        // 右键菜单时确保不保留拖动状态
        container.addEventListener('contextmenu', (e) => {
            this.isDragging = false;
        });
    }

    initTouchEvents() {
        const container = document.getElementById('radio-container');
        
        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50; // 滑动阈值
        const swipeDistance = this.touchEndX - this.touchStartX;

        if (Math.abs(swipeDistance) < swipeThreshold) return;

        if (swipeDistance > 0) {
            // 向右滑动，显示上一页
            if (this.currentPage > 1) {
                this.changePage(this.currentPage - 1);
            }
        } else {
            // 向左滑动，显示下一页
            if (this.currentPage < this.totalPages) {
                this.changePage(this.currentPage + 1);
            }
        }
    }

    createPages() {
        const container = document.getElementById('radio-container');
        container.innerHTML = ''; // 清空现有内容

        // 创建页面
        for (let i = 1; i <= this.totalPages; i++) {
            const page = document.createElement('div');
            page.id = `rpage${i}`;
            page.className = `rpage ${i === 1 ? 'active' : 'inactive'}`;
            
            const grid = document.createElement('div');
            grid.className = 'radio-grid';
            
            // 获取当前页的电台
            const startIndex = (i - 1) * this.stationsPerPage;
            const endIndex = Math.min(startIndex + this.stationsPerPage, this.radioStations.length);
            const pageStations = this.radioStations.slice(startIndex, endIndex);

            // 创建电台按钮
            pageStations.forEach(station => {
                const button = this.createRadioButton(station);
                grid.appendChild(button);
            });

            page.appendChild(grid);
            container.appendChild(page);
        }
    }

    createRadioButton(station) {
        const button = document.createElement('div');
        button.className = 'radio-button';
        button.setAttribute('data-station-id', station.params.id);
        let longPressTriggered = false;
        
        const icon = document.createElement('div');
        icon.className = 'radio-icon';
        icon.style.backgroundImage = `url(${station.icon})`;
        
        const name = document.createElement('span');
        name.className = 'radio-name';
        name.textContent = station.name;

        if (this.savedStationIds.has(String(station.params.id))) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'radio-delete-button';
            deleteButton.type = 'button';
            deleteButton.textContent = '\u00d7';
            deleteButton.title = '删除此电台';
            deleteButton.setAttribute('aria-label', `删除${station.name}`);
            deleteButton.addEventListener('click', async (event) => {
                event.stopPropagation();
                deleteButton.disabled = true;
                try {
                    const deletedId = String(station.params.id);
                    await deleteSavedRadioStation(deletedId);
                    this.savedStationIds.delete(deletedId);
                    this.radioStations = this.radioStations.filter(
                        item => String(item.params.id) !== deletedId
                    );
                    saveOrder(this.radioStations.map(item => String(item.params.id)));
                    this.totalPages = Math.ceil(this.radioStations.length / this.stationsPerPage);
                    this.currentPage = Math.min(this.currentPage, Math.max(this.totalPages, 1));
                    this.showAllPages = false;
                    this.recreatePages();
                } catch (error) {
                    console.error('删除电台失败:', error);
                    deleteButton.disabled = false;
                }
            });
            button.appendChild(deleteButton);

            button.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                button.classList.add('show-delete-button');
            });

            let longPressTimer = null;
            button.addEventListener('pointerdown', (event) => {
                longPressTriggered = false;
                if (event.pointerType !== 'touch') return;
                longPressTimer = setTimeout(() => {
                    button.classList.add('show-delete-button');
                    longPressTriggered = true;
                }, 550);
            });
            const clearLongPress = () => {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            };
            button.addEventListener('pointerup', clearLongPress);
            button.addEventListener('pointercancel', clearLongPress);
        }
        
        button.appendChild(icon);
        button.appendChild(name);
        
        // 使用统一的播放函数
        button.onclick = () => {
            if (this.ignoreNextRadioClick) {
                this.ignoreNextRadioClick = false;
                return;
            }
            if (longPressTriggered) return;
            setPlaybackInfo(
                station.params.url,
                station.params.title,
                station.params.cover,
                station.params.channel,
                station.params.id,
                station.params.mark
            );
        };
        
        return button;
    }

    createPaginationIndicator() {
        const container = document.getElementById('radio-container');

        // 移除可能已存在的指示器，避免重复绑定事件或覆盖
        const existing = container.querySelector('.pagination');
        if (existing) existing.remove();

        const pagination = document.createElement('div');
        pagination.className = 'pagination';

        const line = document.createElement('div');
        line.className = 'pagination-line';
        line.style.display = 'flex';
        line.style.justifyContent = 'center';
        line.style.gap = '10px';
        line.setAttribute('aria-label', '页码；右键或长按显示全部页码');

        // 委托点击事件，避免在生成时意外触发多次绑定或闭包问题
        line.addEventListener('click', (e) => {
            if (this.ignoreNextPaginationClick) {
                this.ignoreNextPaginationClick = false;
                return;
            }
            const target = e.target.closest('.pagination-dot');
            if (!target) return;
            const page = parseInt(target.dataset.page, 10);
            if (!isNaN(page)) {
                this.showAllPages = false;
                this.changePage(page);
            }
        });

        line.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showAllPages = true;
            this.renderPaginationDots();
        });

        line.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'touch') return;
            this.paginationLongPressTimer = setTimeout(() => {
                this.showAllPages = true;
                this.ignoreNextPaginationClick = true;
                this.renderPaginationDots();
            }, 550);
        });

        const clearLongPress = () => {
            clearTimeout(this.paginationLongPressTimer);
            this.paginationLongPressTimer = null;
            setTimeout(() => {
                this.ignoreNextPaginationClick = false;
            }, 0);
        };
        line.addEventListener('pointerup', clearLongPress);
        line.addEventListener('pointercancel', clearLongPress);

        this.paginationLine = line;

        pagination.appendChild(line);
        container.appendChild(pagination);
        this.renderPaginationDots();
    }

    renderPaginationDots() {
        const line = this.paginationLine;
        if (!line) return;

        line.innerHTML = '';
        const maxVisiblePages = 7;
        const startPage = this.showAllPages || this.totalPages <= maxVisiblePages
            ? 1
            : Math.max(1, Math.min(
                this.currentPage - Math.floor(maxVisiblePages / 2),
                this.totalPages - maxVisiblePages + 1
            ));
        const endPage = this.showAllPages
            ? this.totalPages
            : Math.min(this.totalPages, startPage + maxVisiblePages - 1);

        for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'pagination-dot';
            dot.textContent = pageNumber;
            dot.dataset.page = String(pageNumber);
            dot.setAttribute('aria-label', `第 ${pageNumber} 页`);
            dot.setAttribute('aria-current', pageNumber === this.currentPage ? 'page' : 'false');
            if (pageNumber === this.currentPage) dot.classList.add('active');
            line.appendChild(dot);
        }
    }

    updatePaginationIndicator(currentPage) {
        this.currentPage = currentPage;
        this.renderPaginationDots();
    }

    initSortable() {
        const grids = document.querySelectorAll('.radio-grid');
        grids.forEach(grid => {
            new window.Sortable(grid, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: (evt) => {
                    this.updateOrder();
                }
            });
        });
    }

    updateOrder() {
        const newOrder = [];
        document.querySelectorAll('.radio-button').forEach(button => {
            newOrder.push(button.getAttribute('data-station-id'));
        });
        saveOrder(newOrder);
    }

    changePage(newPageNum) {
        if (newPageNum < 1 || newPageNum > this.totalPages) return;
        
        const pages = document.querySelectorAll('.rpage');
        const newPage = document.getElementById(`rpage${newPageNum}`);
        
        if (!newPage) return;

        const currentPage = document.querySelector('.rpage.active');
        if (currentPage === newPage) {
            this.currentPage = newPageNum;
            this.updatePaginationIndicator(this.currentPage);
            localStorage.setItem('lastViewedPage', newPageNum);
            return;
        }

        const transitionClasses = [
            'page-enter-from-left',
            'page-enter-from-right',
            'page-exit-to-left',
            'page-exit-to-right'
        ];
        const activePageNum = currentPage
            ? Number.parseInt(currentPage.id.slice(5), 10)
            : this.currentPage;
        const movingForward = newPageNum > activePageNum;
        const enterClass = movingForward ? 'page-enter-from-right' : 'page-enter-from-left';
        const exitClass = movingForward ? 'page-exit-to-left' : 'page-exit-to-right';

        pages.forEach(page => {
            if (page === newPage) return;

            const wasActive = page.classList.contains('active');
            page.classList.remove('active', ...transitionClasses);
            if (!wasActive) {
                page.classList.add('inactive');
                return;
            }

            page.classList.add(exitClass);
            page.addEventListener('animationend', (event) => {
                if (event.target !== page || page.classList.contains('active') ||
                    !page.classList.contains(exitClass)) return;
                page.classList.remove(exitClass);
                page.classList.add('inactive');
            }, { once: true });
        });

        newPage.classList.remove('inactive', ...transitionClasses);
        newPage.classList.add('active', enterClass);
        newPage.addEventListener('animationend', (event) => {
            if (event.target === newPage) newPage.classList.remove(enterClass);
        }, { once: true });
        
        this.currentPage = newPageNum;
        this.updatePaginationIndicator(this.currentPage);
        localStorage.setItem('lastViewedPage', newPageNum);
    }

    showNewPage(page) {
        if (!page) return; // 添加空值检查
        page.classList.remove('inactive');
        page.classList.add('fadeIn');
        page.addEventListener('animationend', () => {
            page.classList.remove('fadeIn');
        }, { once: true });
    }

    recreatePages() {
        this.totalPages = Math.ceil(this.radioStations.length / this.stationsPerPage);
        this.currentPage = Math.min(Math.max(this.currentPage, 1), Math.max(this.totalPages, 1));
        this.createPages();
        this.createPaginationIndicator();
        if (this.totalPages > 0) {
            this.changePage(this.currentPage);
        }
    }
}

// 初始化
function initializeRadioManager() {
    if (document.getElementById('radio-container')) {
        new RadioManager();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRadioManager, { once: true });
} else {
    initializeRadioManager();
}
