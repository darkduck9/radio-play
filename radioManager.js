import { getRadio, saveOrder } from './radioinfo.js';

class RadioManager {
    constructor() {
        this.radioStations = getRadio();
        this.stationsPerPage = 9;
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.radioStations.length / this.stationsPerPage);
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.init();
    }

    init() {
        this.createPages();
        this.initContextMenu();
        this.initTouchEvents();
        this.initMouseEvents();
        this.createPaginationIndicator();
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

        // 添加右键菜单事件
        container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 确保菜单不会超出容器边界
            const menuWidth = 150;
            const menuHeight = 40;
            let left = e.clientX;
            let top = e.clientY;
            
            if (left + menuWidth > window.innerWidth) {
                left = window.innerWidth - menuWidth;
            }
            if (top + menuHeight > window.innerHeight) {
                top = window.innerHeight - menuHeight;
            }
            
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${left}px`;
            contextMenu.style.top = `${top}px`;
        });

        // 点击其他地方关闭菜单
        document.addEventListener('click', (e) => {
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
        sortingModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const sortingContainer = document.createElement('div');
        sortingContainer.className = 'sorting-container';
        sortingContainer.style.cssText = `
            background: #fff;
            border-radius: 12px;
            width: 90%;
            max-width: 1200px;
            height: 90%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        const sortingHeader = document.createElement('div');
        sortingHeader.className = 'sorting-header';
        sortingHeader.style.cssText = `
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        // 添加每页显示数量设置
        const pageSizeControl = document.createElement('div');
        pageSizeControl.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        pageSizeControl.innerHTML = `
            <span>每页显示：</span>
            <select id="pageSizeSelect" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #ddd;">
                <option value="9">9个</option>
                <option value="12">12个</option>
                <option value="16">16个</option>
                <option value="20">20个</option>
            </select>
        `;

        sortingHeader.innerHTML = `
            <h2 style="margin: 0; font-size: 1.5em;">调整电台顺序</h2>
            <div style="display: flex; align-items: center; gap: 20px;">
                ${pageSizeControl.outerHTML}
                <button class="close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
        `;

        const sortingContent = document.createElement('div');
        sortingContent.className = 'sorting-content';
        sortingContent.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            position: relative;
            background: #fff;
        `;

        // 创建分页容器
        const pagesContainer = document.createElement('div');
        pagesContainer.className = 'sorting-pages';
        pagesContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 10px;
        `;

        // 创建分页指示器
        const paginationIndicator = document.createElement('div');
        paginationIndicator.className = 'sorting-pagination';
        paginationIndicator.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        `;

        // 初始化分页
        let currentPageSize = 9;
        let currentPage = 1;
        let totalPages = Math.ceil(self.radioStations.length / currentPageSize);

        function updatePages() {
            pagesContainer.innerHTML = '';
            paginationIndicator.innerHTML = '';

            // 创建分页
            for (let i = 1; i <= totalPages; i++) {
                const page = document.createElement('div');
                page.className = 'sorting-page';
                page.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 10px;
                    margin-bottom: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                `;

                // 添加分页标题
                const pageHeader = document.createElement('div');
                pageHeader.style.cssText = `
                    grid-column: 1 / -1;
                    padding: 10px;
                    background: #e9ecef;
                    border-radius: 4px;
                    margin-bottom: 10px;
                    font-weight: bold;
                    color: #495057;
                `;
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
                    stationElement.style.cssText = `
                        background: #fff;
                        border-radius: 8px;
                        padding: 10px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        cursor: move;
                        transition: transform 0.2s, box-shadow 0.2s;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    `;
                    stationElement.innerHTML = `
                        <img src="${station.icon}" alt="${station.name}" style="width: 40px; height: 40px; object-fit: contain;">
                        <span style="flex: 1; font-size: 14px;">${station.name}</span>
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
        sortingFooter.style.cssText = `
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        `;
        sortingFooter.innerHTML = `
            <button class="cancel-btn" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer;">取消</button>
            <button class="save-btn" style="padding: 8px 16px; border: none; border-radius: 4px; background: #007bff; color: #fff; cursor: pointer;">保存</button>
        `;

        sortingContent.appendChild(pagesContainer);
        sortingContent.appendChild(paginationIndicator);
        sortingContainer.appendChild(sortingHeader);
        sortingContainer.appendChild(sortingContent);
        sortingContainer.appendChild(sortingFooter);
        sortingModal.appendChild(sortingContainer);
        document.body.appendChild(sortingModal);

        // 添加每页显示数量变化事件
        document.getElementById('pageSizeSelect').addEventListener('change', (e) => {
            currentPageSize = parseInt(e.target.value);
            currentPage = 1;
            totalPages = Math.ceil(self.radioStations.length / currentPageSize);
            updatePages();
        });

        // 添加关闭按钮事件
        sortingModal.querySelector('.close-btn').addEventListener('click', () => {
            sortingModal.remove();
        });

        // 添加取消按钮事件
        sortingModal.querySelector('.cancel-btn').addEventListener('click', () => {
            sortingModal.remove();
        });

        // 添加保存按钮事件
        sortingModal.querySelector('.save-btn').addEventListener('click', () => {
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
                errorModal.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 2100;
                    max-width: 80%;
                `;

                errorModal.innerHTML = `
                    <h3 style="color: #dc3545; margin-top: 0;">无法保存：存在重复的电台ID</h3>
                    <p>以下电台的ID重复，请修改后再保存：</p>
                    <ul style="color: #dc3545;">
                        ${duplicateStations.map(name => `<li>${name}</li>`).join('')}
                    </ul>
                    <p>请修改电台ID后再尝试保存。</p>
                    <button style="
                        padding: 8px 16px;
                        background: #007bff;
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 10px;
                    ">确定</button>
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
            self.radioStations = getRadio();
            self.stationsPerPage = currentPageSize;
            self.recreatePages();
            sortingModal.remove();
        });

        // 添加ESC键关闭
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                sortingModal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        });

        function showStationContextMenu(e, station) {
            e.preventDefault();
            
            // 创建右键菜单
            const contextMenu = document.createElement('div');
            contextMenu.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                background: rgba(0, 0, 0, 0.9);
                border-radius: 8px;
                padding: 8px 0;
                min-width: 150px;
                z-index: 2100;
            `;

            const editOption = document.createElement('div');
            editOption.textContent = '编辑电台信息';
            editOption.style.cssText = `
                padding: 8px 16px;
                color: #fff;
                cursor: pointer;
                transition: background-color 0.2s;
            `;
            editOption.onmouseover = () => editOption.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            editOption.onmouseout = () => editOption.style.backgroundColor = 'transparent';
            editOption.onclick = () => {
                showEditStationModal(station);
                contextMenu.remove();
            };

            contextMenu.appendChild(editOption);
            document.body.appendChild(contextMenu);

            // 点击其他地方关闭菜单
            const closeMenu = (e) => {
                if (!contextMenu.contains(e.target)) {
                    contextMenu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
        }

        function showEditStationModal(station) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2200;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: #fff;
                padding: 20px;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
            `;

            const form = document.createElement('form');
            form.innerHTML = `
                <h3 style="margin-top: 0;">编辑电台信息</h3>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">电台名称</label>
                    <input type="text" name="name" value="${station.name}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">图标URL</label>
                    <input type="text" name="icon" value="${station.icon}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">播放地址</label>
                    <input type="text" name="url" value="${station.params.url}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">标题</label>
                    <input type="text" name="title" value="${station.params.title}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">封面URL</label>
                    <input type="text" name="cover" value="${station.params.cover}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">频道</label>
                    <input type="text" name="channel" value="${station.params.channel}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">ID</label>
                    <input type="text" name="id" value="${station.params.id}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">标记</label>
                    <input type="number" name="mark" value="${station.params.mark}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button type="button" class="cancel-btn" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer;">取消</button>
                    <button type="submit" class="save-btn" style="padding: 8px 16px; border: none; border-radius: 4px; background: #007bff; color: #fff; cursor: pointer;">保存</button>
                </div>
            `;

            form.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                
                // 更新电台信息
                const updatedStation = {
                    name: formData.get('name'),
                    icon: formData.get('icon'),
                    params: {
                        url: formData.get('url'),
                        title: formData.get('title'),
                        cover: formData.get('cover'),
                        channel: formData.get('channel'),
                        id: formData.get('id'),
                        mark: parseInt(formData.get('mark'))
                    }
                };

                try {
                    // 保存到 IndexedDB
                    const db = await openDB();
                    const tx = db.transaction('radioStations', 'readwrite');
                    const store = tx.objectStore('radioStations');
                    
                    // 更新电台信息
                    await store.put(updatedStation, station.params.id);
                    
                    // 更新内存中的电台信息
                    const index = self.radioStations.findIndex(s => s.params.id === station.params.id);
                    if (index !== -1) {
                        self.radioStations[index] = updatedStation;
                    }

                    // 刷新显示
                    updatePages();
                    modal.remove();
                } catch (error) {
                    console.error('保存失败:', error);
                    alert('保存失败，请重试');
                }
            };

            modalContent.appendChild(form);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // 添加取消按钮事件
            modal.querySelector('.cancel-btn').onclick = () => modal.remove();

            // 添加ESC键关闭
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        // 为每个电台添加右键菜单事件
        pagesContainer.querySelectorAll('.sorting-station').forEach(stationElement => {
            stationElement.addEventListener('contextmenu', (e) => {
                const stationId = stationElement.getAttribute('data-station-id');
                const station = self.radioStations.find(s => s.params.id === stationId);
                if (station) {
                    showStationContextMenu(e, station);
                }
            });
        });

        // 添加 IndexedDB 相关函数
        function openDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('RadioDB', 1);
                
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
                
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('radioStations')) {
                        db.createObjectStore('radioStations', { keyPath: 'id' });
                    }
                };
            });
        }
    }

    initMouseEvents() {
        const container = document.getElementById('radio-container');
        
        container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.touchStartX = e.clientX;
        });

        container.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.touchEndX = e.clientX;
        });

        container.addEventListener('mouseup', () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.handleSwipe();
        });

        container.addEventListener('mouseleave', () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.handleSwipe();
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
            page.style.opacity = i === 1 ? '1' : '0';
            page.style.transform = 'translateX(0)';
            
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
        
        const icon = document.createElement('div');
        icon.className = 'radio-icon';
        icon.style.backgroundImage = `url(${station.icon})`;
        
        const name = document.createElement('span');
        name.className = 'radio-name';
        name.textContent = station.name;
        
        button.appendChild(icon);
        button.appendChild(name);
        
        // 使用统一的播放函数
        button.onclick = () => {
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
        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        
        const line = document.createElement('div');
        line.className = 'pagination-line';
        
        // 创建多个指示点
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'pagination-dot';
            dot.textContent = i + 1;
            if (i === 0) dot.classList.add('active');
            
            // 添加点击事件
            dot.addEventListener('click', () => {
                this.changePage(i + 1);
            });
            
            line.appendChild(dot);
        }
        
        pagination.appendChild(line);
        container.appendChild(pagination);
    }

    updatePaginationIndicator(currentPage) {
        const dots = document.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            if (index + 1 === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
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
        
        // 添加淡入淡出动画
        pages.forEach(page => {
            if (page === newPage) {
                // 新页面淡入
                page.style.opacity = '0';
                page.style.transform = 'translateX(0)';
                page.classList.remove('inactive');
                page.classList.add('active');
                
                // 使用 requestAnimationFrame 确保过渡效果生效
                requestAnimationFrame(() => {
                    page.style.opacity = '1';
                });
            } else {
                // 其他页面淡出
                page.style.opacity = '0';
                page.style.transform = 'translateX(0)';
                page.classList.remove('active');
                page.classList.add('inactive');
            }
        });
        
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
        this.createPages();
        this.createPaginationIndicator();
        this.updatePaginationIndicator(this.currentPage);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new RadioManager();
}); 