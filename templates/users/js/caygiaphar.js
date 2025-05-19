// Khởi tạo biến toàn cục cho GoJS
var $ = go.GraphObject.make;
var myDiagram = $(go.Diagram, "myDiagramDiv", {
    "undoManager.isEnabled": true,
    layout: $(go.TreeLayout, {
        angle: 90,
        layerSpacing: 50,
        alignment: go.TreeLayout.AlignmentStart
    }),
    // Thêm cấu hình cho công cụ liên kết
    "linkingTool.direction": go.LinkingTool.ForwardsOnly,
    "linkingTool.portGravity": 20,
    "relinkingTool.fromHandleArchetype": $(go.Shape, "Diamond", { width: 8, height: 8, fill: "#4e73df" }),
    "relinkingTool.toHandleArchetype": $(go.Shape, "Diamond", { width: 8, height: 8, fill: "#4e73df" }),
    "linkReshapingTool.handleArchetype": $(go.Shape, "Diamond", { width: 8, height: 8, fill: "#4e73df" })
});

// Định nghĩa node template với hỗ trợ theme
function getNodeTemplate() {
    return $(go.Node, "Vertical",
        {
            click: function(e, node) {
                // Lấy dữ liệu từ node
                var data = node.data;
                
                // Cập nhật thông tin vào modal
                document.getElementById('memberImage').src = "../../../assets/images/" + data.pic;
                document.getElementById('memberName').textContent = data.name;
                document.getElementById('memberRole').textContent = getRoleName(data.role);
                document.getElementById('memberGeneration').textContent = "Đời thứ " + data.generation;
                document.getElementById('memberPhone').textContent = data.phone || "Không có";
                document.getElementById('memberEmail').textContent = data.email || "Không có";
                
                // Hiển thị modal
                var modal = new bootstrap.Modal(document.getElementById('memberDetailModal'));
                modal.show();
            }
        },
        $(go.Panel, "Auto",
            $(go.Shape, "RoundedRectangle", {
                fill: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary'),
                stroke: getComputedStyle(document.documentElement).getPropertyValue('--btn-primary').split(',')[0].replace('linear-gradient(145deg', '').trim(),
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
                    return "../../../assets/images/" + pic;
                })),
                $(go.TextBlock, {
                    font: "bold 14px sans-serif",
                    textAlign: "center",
                    margin: 4,
                    stroke: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                },
                new go.Binding("text", "name")),
                $(go.TextBlock, {
                    font: "12px sans-serif",
                    textAlign: "center",
                    margin: 4,
                    stroke: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
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
                    margin: 4,
                    stroke: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                },
                new go.Binding("text", "generation", function(gen) {
                    return "Đời thứ " + gen;
                })),
                $(go.TextBlock, {
                    font: "12px sans-serif",
                    textAlign: "center",
                    margin: 4,
                    stroke: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                },
                new go.Binding("text", "phone")),
                $(go.TextBlock, {
                    font: "12px sans-serif",
                    textAlign: "center",
                    margin: 4,
                    stroke: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                },
                new go.Binding("text", "email"))
            )
        )
    );
}

// Thêm hàm helper để chuyển đổi role
function getRoleName(role) {
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
}

// Cập nhật node template
myDiagram.nodeTemplate = getNodeTemplate();

// Định nghĩa link template với hỗ trợ theme
// Cập nhật link template để hỗ trợ các loại kết nối
myDiagram.linkTemplate =
    $(go.Link,
        { 
            routing: go.Link.Orthogonal,
            corner: 5,
            selectable: true
        },
        new go.Binding("routing", "linkType", function(type) {
            return type === "same_level" ? go.Link.Normal : go.Link.Orthogonal;
        }),
        $(go.Shape, { 
            strokeWidth: 2,
            stroke: getComputedStyle(document.documentElement).getPropertyValue('--btn-primary').split(',')[0].replace('linear-gradient(145deg', '').trim()
        }),
        $(go.Shape,
            new go.Binding("toArrow", "linkType", function(type) {
                return type === "parent_child" ? "Standard" : "";
            }),
            { 
                stroke: getComputedStyle(document.documentElement).getPropertyValue('--btn-primary').split(',')[0].replace('linear-gradient(145deg', '').trim(),
                fill: getComputedStyle(document.documentElement).getPropertyValue('--btn-primary').split(',')[0].replace('linear-gradient(145deg', '').trim()
            }
        ),
        $(go.Panel, "Auto",
            new go.Binding("visible", "linkType", function(type) {
                return type === "parent_child";
            }),
            $(go.Shape, "RoundedRectangle", {
                fill: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary'),
                stroke: getComputedStyle(document.documentElement).getPropertyValue('--btn-primary').split(',')[0].replace('linear-gradient(145deg', '').trim()
            }),
            $(go.TextBlock, {
                margin: 5,
                font: "10px sans-serif",
                stroke: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
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

// Xử lý chuyển đổi theme
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('themeSwitch');
    const icon = themeSwitch.querySelector('i');
    
    // Kiểm tra theme đã lưu
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
    
    themeSwitch.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        
        // Cập nhật lại diagram khi đổi theme
        myDiagram.nodeTemplate = getNodeTemplate();
        myDiagram.linkTemplate =
            $(go.Link,
                { routing: go.Link.Orthogonal, corner: 5 },
                $(go.Shape, { 
                    strokeWidth: 2,
                    stroke: getComputedStyle(document.documentElement).getPropertyValue('--btn-primary').split(',')[0].replace('linear-gradient(145deg', '').trim()
                })
            );
        myDiagram.rebuildParts();
    });
    
    function updateIcon(theme) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Load dữ liệu từ localStorage
    const savedData = localStorage.getItem('familyTreeData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            // Sử dụng GraphLinksModel thay vì TreeModel để hiển thị cả nodes và links
            var model = new go.GraphLinksModel();
            model.nodeDataArray = data.nodes || [];
            model.linkDataArray = data.links || [];
            myDiagram.model = model;
        } catch (error) {
            console.error('Lỗi khi load dữ liệu:', error);
            myDiagram.model = new go.GraphLinksModel([]);
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

// Thêm hàm lưu vào localStorage
function saveToLocalStorage() {
    const data = {
        nodes: myDiagram.model.nodeDataArray,
        links: myDiagram.model.linkDataArray
    };
    localStorage.setItem('familyTreeData', JSON.stringify(data));
}