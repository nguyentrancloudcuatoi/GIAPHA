var $ = go.GraphObject.make;
        var myDiagram = $(go.Diagram, "myDiagramDiv", {
            "undoManager.isEnabled": true,
            layout: $(go.TreeLayout, {
                angle: 90,
                layerSpacing: 50,
                alignment: go.TreeLayout.AlignmentStart
            }),
            "linkingTool.direction": go.LinkingTool.ForwardsOnly,
            "linkingTool.portGravity": 20,
            "relinkingTool.fromHandleArchetype": $(go.Shape, "Diamond", { width: 8, height: 8, fill: "#4e73df" }),
            "relinkingTool.toHandleArchetype": $(go.Shape, "Diamond", { width: 8, height: 8, fill: "#4e73df" }),
            "linkReshapingTool.handleArchetype": $(go.Shape, "Diamond", { width: 8, height: 8, fill: "#4e73df" })
        });

        var linkModeEnabled = false;

        // Thêm biến để lưu trữ thông tin kết nối
        var fromNode = null;
        var toNode = null;

        // Cập nhật hàm toggleLinkMode
        function toggleLinkMode() {
            linkModeEnabled = !linkModeEnabled;
            myDiagram.allowLink = linkModeEnabled;
            
            // Thay đổi màu nút khi chế độ nối được bật/tắt
            const linkButton = document.querySelector('button[onclick="toggleLinkMode()"]');
            if (linkModeEnabled) {
                linkButton.classList.remove('btn-primary');
                linkButton.classList.add('btn-success');
                alert('Chế độ kết nối đã được bật!\nHãy click vào thành viên nguồn, sau đó click vào thành viên đích để tạo kết nối.');
            } else {
                linkButton.classList.remove('btn-success');
                linkButton.classList.add('btn-primary');
                fromNode = null;
                toNode = null;
            }
        }

        // Thêm biến để lưu trữ chế độ xóa
        var deleteModeEnabled = false;
        
        // Thêm hàm toggleDeleteMode
        function toggleDeleteMode() {
            deleteModeEnabled = !deleteModeEnabled;
            
            // Thay đổi màu nút khi chế độ xóa được bật/tắt
            const deleteButton = document.querySelector('button[onclick="toggleDeleteMode()"]');
            if (deleteModeEnabled) {
                deleteButton.classList.remove('btn-primary');
                deleteButton.classList.add('btn-danger');
                alert('Chế độ xóa đã được bật!\nClick vào thành viên hoặc đường nối để xóa.\nBạn cũng có thể xóa toàn bộ dữ liệu bằng cách nhấn giữ phím Ctrl và click vào nút Xóa.');
            } else {
                deleteButton.classList.remove('btn-danger');
                deleteButton.classList.add('btn-primary');
            }
        }

        // Cập nhật node template để thêm xử lý click cho xóa
        myDiagram.nodeTemplate =
            $(go.Node, "Vertical",
                {
                    click: function(e, node) {
                        if (deleteModeEnabled) {
                            if (confirm('Bạn có chắc chắn muốn xóa thành viên "' + node.data.name + '" không?')) {
                                myDiagram.model.removeNodeData(node.data);
                                // Xóa tất cả các liên kết liên quan đến node này
                                var linksToRemove = node.findLinksConnected().toArray();
                                linksToRemove.forEach(function(link) {
                                    myDiagram.model.removeLinkData(link.data);
                                });
                                saveToLocalStorage();
                                alert('Đã xóa thành viên thành công!');
                            }
                        } else if (linkModeEnabled) {
                            if (!fromNode) {
                                fromNode = node;
                                // Tạo và hiển thị popup chọn loại kết nối
                                var linkTypePopup = document.createElement('div');
                                linkTypePopup.style.position = 'fixed';
                                linkTypePopup.style.top = '50%';
                                linkTypePopup.style.left = '50%';
                                linkTypePopup.style.transform = 'translate(-50%, -50%)';
                                linkTypePopup.style.backgroundColor = 'white';
                                linkTypePopup.style.padding = '20px';
                                linkTypePopup.style.border = '2px solid #4e73df';
                                linkTypePopup.style.borderRadius = '5px';
                                linkTypePopup.style.zIndex = '1000';
                                linkTypePopup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

                                linkTypePopup.innerHTML = `
                                    <h4 style="margin-bottom: 15px; color: #4e73df;">Chọn loại kết nối</h4>
                                    <div style="display: flex; flex-direction: column; gap: 10px;">
                                        <button id="sameLevelBtn" style="padding: 10px; background-color: #4e73df; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                            Kết nối ngang hàng (không mũi tên)
                                        </button>
                                        <button id="parentChildBtn" style="padding: 10px; background-color: #4e73df; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                            Kết nối cha-con (có mũi tên)
                                        </button>
                                    </div>
                                `;

                                document.body.appendChild(linkTypePopup);

                                // Xử lý sự kiện click cho các nút
                                document.getElementById('sameLevelBtn').onclick = function() {
                                    fromNode.linkType = 'same_level';
                                    document.body.removeChild(linkTypePopup);
                                    alert('Đã chọn thành viên nguồn: ' + node.data.name + '\nHãy chọn thành viên đích để kết nối.');
                                };

                                document.getElementById('parentChildBtn').onclick = function() {
                                    fromNode.linkType = 'parent_child';
                                    document.body.removeChild(linkTypePopup);
                                    alert('Đã chọn thành viên nguồn: ' + node.data.name + '\nHãy chọn thành viên đích để kết nối.');
                                };
                            } else {
                                toNode = node;
                                if (fromNode !== toNode) {
                                    if (confirm('Bạn muốn tạo kết nối từ ' + fromNode.data.name + ' đến ' + toNode.data.name + '?')) {
                                        var linkData = {
                                            from: fromNode.data.key,
                                            to: toNode.data.key,
                                            linkType: fromNode.linkType
                                        };
                                        myDiagram.model.addLinkData(linkData);
                                        saveToLocalStorage();
                                        alert('Đã tạo kết nối thành công!');
                                    }
                                } else {
                                    alert('Không thể kết nối một thành viên với chính họ!');
                                }
                                fromNode = null;
                                toNode = null;
                            }
                        }
                    }
                },
                $(go.Panel, "Auto",
                    $(go.Shape, "RoundedRectangle", {
                        fill: "white",
                        stroke: "#4e73df",
                        strokeWidth: 2
                    }),
                    $(go.Panel, "Vertical",
                        { margin: 8 },
                        $(go.Picture, {
                            width: 70,
                            height: 70,
                            margin: new go.Margin(4, 4, 4, 4)
                        },
                        new go.Binding("source", "pic", function(pic) {
                            return "../assets/images/" + pic;
                        })),
                        $(go.TextBlock, {
                            font: "bold 14px sans-serif",
                            textAlign: "center",
                            margin: 4
                        },
                        new go.Binding("text", "name")),
                        $(go.TextBlock, {
                            font: "12px sans-serif",
                            textAlign: "center",
                            margin: 4
                        },
                        new go.Binding("text", "role", function(role) {
                            const roleNames = {
                                ong_noi: "Ông nội",
                                ba_noi: "Bà nội",
                                ong_ngoai: "Ông ngoại",
                                ba_ngoai: "Bà ngoại",
                                cha: "Cha",
                                me: "Mẹ",
                                chu: "Chú",
                                bac: "Bác",
                                co: "Cô",
                                di: "Dì",
                                anh: "Anh",
                                chi: "Chị",
                                em: "Em",
                                chau: "Cháu"
                            };
                            return roleNames[role] || role;
                        })),
                        $(go.TextBlock, {
                            font: "12px sans-serif",
                            textAlign: "center",
                            margin: 4
                        },
                        new go.Binding("text", "generation", function(gen) {
                            return "Đời thứ " + gen;
                        })),
                        $(go.TextBlock, {
                            font: "12px sans-serif",
                            textAlign: "center",
                            margin: 4
                        },
                        new go.Binding("text", "title")),
                        $(go.TextBlock, {
                            font: "12px sans-serif",
                            textAlign: "center",
                            margin: 4
                        },
                        new go.Binding("text", "phone")),
                        $(go.TextBlock, {
                            font: "12px sans-serif",
                            textAlign: "center",
                            margin: 4
                        },
                        new go.Binding("text", "email"))
                    )
                )
            );

        // Định nghĩa link template với 2 loại kết nối
        myDiagram.linkTemplate =
            $(go.Link,
                { 
                    routing: go.Link.Orthogonal,
                    corner: 5,
                    selectable: true,
                    relinkableFrom: true,
                    relinkableTo: true,
                    click: function(e, link) {
                        if (deleteModeEnabled) {
                            if (confirm('Bạn có chắc chắn muốn xóa kết nối này không?')) {
                                myDiagram.model.removeLinkData(link.data);
                                saveToLocalStorage();
                                alert('Đã xóa kết nối thành công!');
                            }
                        }
                    }
                },
                new go.Binding("routing", "linkType", function(type) {
                    // Kết nối ngang hàng sẽ là đường thẳng
                    return type === "same_level" ? go.Link.Normal : go.Link.Orthogonal;
                }),
                $(go.Shape, { 
                    strokeWidth: 2, 
                    stroke: "#4e73df"
                }),
                // Chỉ hiển thị mũi tên cho kết nối cha-con
                $(go.Shape,
                    new go.Binding("toArrow", "linkType", function(type) {
                        return type === "parent_child" ? "Standard" : "";
                    }),
                    { 
                        stroke: "#4e73df",
                        fill: "#4e73df"
                    }
                ),
                // Panel hiển thị thông tin kết nối
                $(go.Panel, "Auto",
                    new go.Binding("visible", "linkType", function(type) {
                        // Chỉ hiển thị panel thông tin cho kết nối cha-con
                        return type === "parent_child";
                    }),
                    $(go.Shape, "RoundedRectangle", {
                        fill: "white",
                        stroke: "#4e73df"
                    }),
                    $(go.TextBlock, {
                        margin: 5,
                        font: "10px sans-serif"
                    },
                    new go.Binding("text", "", function(link) {
                        var fromNode = link.fromNode;
                        var toNode = link.toNode;
                        if (fromNode && toNode) {
                            return fromNode.data.role + " → " + toNode.data.role;
                        }
                        return "";
                    }))
                )
            );

        // Khởi tạo dữ liệu
        var nodeDataArray = [];
        var nextKey = 1;

        // Hàm mở modal thêm thành viên
        function openAddMemberModal() {
            const modal = document.getElementById('addMemberModal');
            modal.style.display = 'block';
        }

        // Hàm đóng modal
        function closeAddMemberModal() {
            document.getElementById('addMemberModal').style.display = 'none';
            document.getElementById('addMemberForm').reset();
        }

        // Xử lý thêm thành viên mới trong JavaScript:
        document.getElementById('addMemberForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newMember = {
                key: nextKey++,
                name: document.getElementById('memberName').value,
                role: document.getElementById('memberRole').value,
                generation: document.getElementById('memberGeneration').value,
                birthDate: document.getElementById('birthDate').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                pic: "default-avatar.png"
            };
        
            // Thêm node mới
            nodeDataArray.push(newMember);
        
            // Cập nhật diagram với GraphLinksModel thay vì TreeModel
            var model = new go.GraphLinksModel();
            model.nodeDataArray = nodeDataArray;
            model.linkDataArray = myDiagram.model.linkDataArray || [];
            myDiagram.model = model;
            
            // Lưu vào localStorage với cả links
            saveToLocalStorage();
        
            closeAddMemberModal();
            alert('Thêm thành viên thành công!');
        });

        // Load dữ liệu từ localStorage khi trang được tải
        document.addEventListener('DOMContentLoaded', function() {
            const savedData = localStorage.getItem('familyTreeData');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    nodeDataArray = data.nodes || [];
                    nextKey = data.nextKey || 1;
                    
                    // Sử dụng GraphLinksModel thay vì TreeModel
                    var model = new go.GraphLinksModel();
                    model.nodeDataArray = nodeDataArray;
                    model.linkDataArray = data.links || [];
                    myDiagram.model = model;
                } catch (error) {
                    console.error('Lỗi khi load dữ liệu:', error);
                    nodeDataArray = [];
                    nextKey = 1;
                    myDiagram.model = new go.GraphLinksModel(nodeDataArray);
                }
            }
        });

        // Các hàm điều khiển
        function zoomIn() {
            myDiagram.commandHandler.increaseZoom();
        }

        function zoomOut() {
            myDiagram.commandHandler.decreaseZoom();
        }

        function centerTree() {
            myDiagram.scale = 1;
            myDiagram.commandHandler.scrollToPart(myDiagram.findNodeForKey(1));
        }

        // Responsive sidebar
        document.querySelector('.menu-btn').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('show');
        });

        // Thêm hàm xóa toàn bộ dữ liệu
        function clearAllData() {
            if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu gia phả? Hành động này không thể hoàn tác!')) {
                // Xóa dữ liệu từ localStorage
                localStorage.clear(); // Thay vì chỉ xóa một item, xóa tất cả
                
                // Reset các biến
                nodeDataArray = [];
                nextKey = 1;
                
                // Cập nhật diagram với model mới hoàn toàn
                myDiagram.model = new go.GraphLinksModel([], []); // Tạo model mới với mảng rỗng
                
                // Cập nhật lại giao diện
                myDiagram.requestUpdate(); // Yêu cầu cập nhật lại diagram
                
                alert('Đã xóa toàn bộ dữ liệu gia phả!');
                
                // Reload trang để đảm bảo mọi thứ được reset
                window.location.reload();
            }
        }

        // Cập nhật sự kiện click cho nút xóa
        document.querySelector('button[onclick="toggleDeleteMode()"]').addEventListener('click', function(e) {
            if (e.ctrlKey && deleteModeEnabled) {
                clearAllData();
            }
        });

        // Thêm hàm lưu dữ liệu vào localStorage
function saveToLocalStorage() {
    const data = {
        nodes: nodeDataArray,
        links: myDiagram.model.linkDataArray,
        nextKey: nextKey
    };
    localStorage.setItem('familyTreeData', JSON.stringify(data));
}

        // Cập nhật hàm tạo kết nối để thêm loại kết nối
        if (linkModeEnabled) {
            if (!fromNode) {
                fromNode = node;
                alert('Đã chọn thành viên nguồn: ' + node.data.name + '\nHãy chọn thành viên đích để kết nối.');
            } else {
                toNode = node;
                if (fromNode !== toNode) {
                    // Xác định loại kết nối dựa trên generation
                    var linkType = fromNode.data.generation === toNode.data.generation ? 
                        "same_level" : "parent_child";
                    
                    if (confirm('Bạn muốn tạo kết nối từ ' + fromNode.data.name + ' đến ' + toNode.data.name + '?')) {
                        var linkData = {
                            from: fromNode.data.key,
                            to: toNode.data.key,
                            linkType: linkType
                        };
                        myDiagram.model.addLinkData(linkData);
                        saveToLocalStorage();
                        alert('Đã tạo kết nối thành công!');
                    }
                } else {
                    alert('Không thể kết nối một thành viên với chính họ!');
                }
                fromNode = null;
                toNode = null;
            }
        }
