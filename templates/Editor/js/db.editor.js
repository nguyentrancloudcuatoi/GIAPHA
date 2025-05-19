// Dữ liệu sự kiện mẫu
const sampleEvents = [
    {
        id: 1,
        type: "Sinh nhật",
        date: "2023-01-15",
        note: "Sinh nhật cụ Nguyễn Văn A - Người sáng lập dòng họ",
        image: "../assets/images/events/birthday.jpg",
        member: "Nguyễn Văn A"
    },
    {
        id: 2,
        type: "Giỗ",
        date: "2023-03-20",
        note: "Ngày giỗ cụ Nguyễn Văn B - Đời thứ 2",
        image: "../assets/images/events/memorial.jpg",
        member: "Nguyễn Văn B"
    },
    {
        id: 3,
        type: "Kết hôn",
        date: "2023-05-10",
        note: "Lễ thành hôn của anh Nguyễn Văn C và chị Trần Thị D",
        image: "../assets/images/events/wedding.jpg",
        member: "Nguyễn Văn C"
    },
    {
        id: 4,
        type: "Tân gia",
        date: "2023-07-25",
        note: "Lễ tân gia nhà thờ họ Nguyễn tại làng An Phú",
        image: "../assets/images/events/house.jpg",
        member: "Dòng họ Nguyễn"
    },
    {
        id: 5,
        type: "Học vấn",
        date: "2023-09-05",
        note: "Lễ tốt nghiệp Đại học của cháu Nguyễn Văn E",
        image: "../assets/images/events/graduation.jpg",
        member: "Nguyễn Văn E"
    }
];

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Ẩn thông báo không có sự kiện
    document.getElementById('noEventMsg').style.display = 'none';
    
    // Hiển thị danh sách sự kiện
    displayEvents(sampleEvents);
    
    // Khởi tạo các bộ lọc
    initializeFilters(sampleEvents);
    
    // Xử lý nút thêm sự kiện
    const addEventBtn = document.getElementById('addEventBtn');
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementById('closeModal');
    
    addEventBtn.onclick = function() {
        eventModal.style.display = 'flex';
    }
    
    closeModal.onclick = function() {
        eventModal.style.display = 'none';
    }
    
    // Đóng modal khi click ngoài
    window.onclick = function(event) {
        if (event.target == eventModal) {
            eventModal.style.display = 'none';
        }
    }
});

// Hiển thị sự kiện
function displayEvents(events) {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';
    
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-image">
                <img src="${event.image}" alt="${event.type}" onerror="this.src='../assets/images/default-event.jpg'">
            </div>
            <div class="event-info">
                <h3>${event.type}</h3>
                <p class="event-date"><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                <p class="event-member"><i class="fas fa-user"></i> ${event.member}</p>
                <p class="event-note">${event.note}</p>
            </div>
        `;
        eventList.appendChild(eventCard);
    });
}

// Khởi tạo bộ lọc
function initializeFilters(events) {
    // Lọc theo thời gian
    const timeFilter = document.getElementById('filterTime');
    const years = [...new Set(events.map(e => new Date(e.date).getFullYear()))];
    years.sort((a, b) => b - a);
    timeFilter.innerHTML = '<option value="">Lọc theo thời gian</option>';
    years.forEach(year => {
        timeFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });
    
    // Lọc theo thành viên
    const memberFilter = document.getElementById('filterMember');
    const members = [...new Set(events.map(e => e.member))];
    memberFilter.innerHTML = '<option value="">Lọc theo thành viên</option>';
    members.forEach(member => {
        memberFilter.innerHTML += `<option value="${member}">${member}</option>`;
    });
    
    // Lọc theo loại sự kiện
    const typeFilter = document.getElementById('filterType');
    const types = [...new Set(events.map(e => e.type))];
    typeFilter.innerHTML = '<option value="">Lọc theo sự kiện</option>';
    types.forEach(type => {
        typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
    });
    
    // Xử lý sự kiện lọc
    [timeFilter, memberFilter, typeFilter].forEach(filter => {
        filter.onchange = function() {
            let filteredEvents = sampleEvents;
            
            const selectedYear = timeFilter.value;
            const selectedMember = memberFilter.value;
            const selectedType = typeFilter.value;
            
            if (selectedYear) {
                filteredEvents = filteredEvents.filter(e => 
                    new Date(e.date).getFullYear() == selectedYear);
            }
            if (selectedMember) {
                filteredEvents = filteredEvents.filter(e => 
                    e.member === selectedMember);
            }
            if (selectedType) {
                filteredEvents = filteredEvents.filter(e => 
                    e.type === selectedType);
            }
            
            displayEvents(filteredEvents);
        }
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
// Khởi tạo các biến và hằng số
let events = JSON.parse(localStorage.getItem('events') || '[]');
const eventList = document.getElementById('eventList');
const noEventMsg = document.getElementById('noEventMsg');
const addEventBtn = document.getElementById('addEventBtn');
const eventModal = document.getElementById('eventModal');
const closeModal = document.getElementById('closeModal');
const eventForm = document.getElementById('eventForm');

// Hàm hiển thị modal thêm sự kiện
function showAddEventModal() {
    eventModal.style.display = 'flex';
}

// Hàm đóng modal
function closeEventModal() {
    eventModal.style.display = 'none';
    eventForm.reset();
}

// Hàm tạo thẻ sự kiện
function createEventCard(event) {
    return `
        <div class="event-card">
            <div class="event-image">
                <img src="${event.image || '../../../assets/images/default-event.jpg'}" alt="Hình ảnh sự kiện">
            </div>
            <div class="event-info">
                <h3>${event.type}</h3>
                <div class="event-date">
                    <i class="fas fa-calendar"></i>
                    ${new Date(event.date).toLocaleDateString('vi-VN')}
                </div>
                <div class="event-member">
                    <i class="fas fa-user"></i>
                    ${event.member || 'Chưa chọn thành viên'}
                </div>
                <div class="event-note">${event.note}</div>
            </div>
        </div>
    `;
}

// Hàm cập nhật danh sách sự kiện
function updateEventList() {
    if (events.length === 0) {
        noEventMsg.style.display = 'block';
        eventList.innerHTML = '';
        return;
    }

    noEventMsg.style.display = 'none';
    eventList.innerHTML = events.map(event => createEventCard(event)).join('');
}

// Hàm lọc sự kiện
function filterEvents() {
    const timeFilter = document.getElementById('filterTime').value;
    const memberFilter = document.getElementById('filterMember').value;
    const typeFilter = document.getElementById('filterType').value;

    let filteredEvents = [...events];

    if (timeFilter !== 'Lọc theo thời gian') {
        // Thêm logic lọc theo thời gian
    }

    if (memberFilter !== 'Lọc theo thành viên') {
        filteredEvents = filteredEvents.filter(event => event.member === memberFilter);
    }

    if (typeFilter !== 'Lọc theo sự kiện') {
        filteredEvents = filteredEvents.filter(event => event.type === typeFilter);
    }

    if (filteredEvents.length === 0) {
        noEventMsg.style.display = 'block';
        eventList.innerHTML = '';
        return;
    }

    noEventMsg.style.display = 'none';
    eventList.innerHTML = filteredEvents.map(event => createEventCard(event)).join('');
}

// Xử lý sự kiện submit form
eventForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newEvent = {
        id: Date.now(),
        type: document.getElementById('eventType').value,
        date: document.getElementById('eventDate').value,
        note: document.getElementById('eventNote').value,
        image: null
    };

    // Xử lý upload hình ảnh
    const imageFile = document.getElementById('eventImage').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newEvent.image = e.target.result;
            events.push(newEvent);
            localStorage.setItem('events', JSON.stringify(events));
            updateEventList();
            closeEventModal();
        };
        reader.readAsDataURL(imageFile);
    } else {
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));
        updateEventList();
        closeEventModal();
    }
});

// Khởi tạo các event listener
addEventBtn.addEventListener('click', showAddEventModal);
closeModal.addEventListener('click', closeEventModal);
document.getElementById('filterTime').addEventListener('change', filterEvents);
document.getElementById('filterMember').addEventListener('change', filterEvents);
document.getElementById('filterType').addEventListener('change', filterEvents);

// Khởi tạo danh sách sự kiện khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    updateEventList();
    
    // Populate filter options
    const memberSelect = document.getElementById('filterMember');
    const typeSelect = document.getElementById('filterType');
    
    // Thêm các option cho filter thời gian
    const timeSelect = document.getElementById('filterTime');
    const timeOptions = ['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'];
    timeOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option;
        timeSelect.appendChild(optionElement);
    });
    
    // Lấy danh sách thành viên từ localStorage (nếu có)
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.name;
        option.textContent = member.name;
        memberSelect.appendChild(option);
    });
    
    // Lấy danh sách loại sự kiện unique từ events
    const eventTypes = [...new Set(events.map(event => event.type))];
    eventTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
});