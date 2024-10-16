const form = document.getElementById('student-form');
const studentList = document.getElementById('student-list');
const errorDiv = document.getElementById('form-error');

// Load students from localStorage when page loads
document.addEventListener('DOMContentLoaded', loadStudentsFromStorage);

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const studentName = document.getElementById('student-name').value.trim();
    const studentID = document.getElementById('student-id').value.trim();
    const studentClass = document.getElementById('student-class').value.trim();
    const studentRollNo = document.getElementById('student-rollNo').value.trim();
    const studentContact = document.getElementById('student-contact').value.trim();
    const studentEmail = document.getElementById('student-email').value.trim();

    if (validateForm(studentName, studentID, studentClass, studentRollNo, studentContact, studentEmail)) {
        // here i make student object so it help in easily modifying the data 
        const student = {
            name: studentName,
            id: studentID,
            class: studentClass,
            rollNo: studentRollNo,
            contact: studentContact,
            email: studentEmail
        };
        addStudentToDOM(student);
        saveStudentToStorage(student);
        form.reset();
        errorDiv.textContent = '';
    } else {
        errorDiv.textContent = 'Please fill in all fields with valid information.';
    }
});
// validForm -> function help in validating the student details using regex
function validateForm(name, id, studentClass, rollNo, contact, email) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const idRegex = /^[0-9]+$/;
    const contactRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
        nameRegex.test(name) &&
        idRegex.test(id) &&
        studentClass !== '' &&
        idRegex.test(rollNo) &&
        contactRegex.test(contact) &&
        emailRegex.test(email)
    );
}
//  here i create different elements such tr, td , button so that we can easily create and append to our table which is define in index.html
function addStudentToDOM(student) {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = student.name;

    const idCell = document.createElement('td');
    idCell.textContent = student.id;

    const classCell = document.createElement('td');
    classCell.textContent = student.class;

    const rollNoCell = document.createElement('td');
    rollNoCell.textContent = student.rollNo;

    const contactCell = document.createElement('td');
    contactCell.textContent = student.contact;

    const emailCell = document.createElement('td');
    emailCell.textContent = student.email;

    const actionsCell = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);

    row.appendChild(nameCell);
    row.appendChild(idCell);
    row.appendChild(classCell);
    row.appendChild(rollNoCell);
    row.appendChild(contactCell);
    row.appendChild(emailCell);
    row.appendChild(actionsCell);

    studentList.appendChild(row);

    deleteBtn.addEventListener('click', function () {
        studentList.removeChild(row);
        deleteStudentFromStorage(student.id);
    });

    editBtn.addEventListener('click', function () {
        if (editBtn.textContent === 'Edit') {
            nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
            idCell.innerHTML = `<input type="text" value="${idCell.textContent}">`;
            classCell.innerHTML = `<input type="text" value="${classCell.textContent}">`;
            rollNoCell.innerHTML = `<input type="text" value="${rollNoCell.textContent}">`;
            contactCell.innerHTML = `<input type="text" value="${contactCell.textContent}">`;
            emailCell.innerHTML = `<input type="email" value="${emailCell.textContent}">`;

            editBtn.textContent = 'Save';
        } else {
            const editedName = nameCell.querySelector('input').value.trim();
            const editedID = idCell.querySelector('input').value.trim();
            const editedClass = classCell.querySelector('input').value.trim();
            const editedRollNo = rollNoCell.querySelector('input').value.trim();
            const editedContact = contactCell.querySelector('input').value.trim();
            const editedEmail = emailCell.querySelector('input').value.trim();

            if (validateForm(editedName, editedID, editedClass, editedRollNo, editedContact, editedEmail)) {
                nameCell.textContent = editedName;
                idCell.textContent = editedID;
                classCell.textContent = editedClass;
                rollNoCell.textContent = editedRollNo;
                contactCell.textContent = editedContact;
                emailCell.textContent = editedEmail;

                // editStudentInStorage(editedID, { name: editedName, id: editedID, class: editedClass, rollNo: editedRollNo, contact: editedContact, email: editedEmail });
                // editBtn.textContent = 'Edit';
                // Update localStorage
                editStudentInStorage(editedID, {
                    name: editedName,
                    id: editedID,
                    class: editedClass,
                    rollNo: editedRollNo,
                    contact: editedContact,
                    email: editedEmail
                });

                editBtn.textContent = 'Edit';
                errorDiv.textContent = '';
            } else {
                errorDiv.textContent = 'Please fill in all fields with valid information.';
            }
        }
    });
}

// Save student to localStorage
// here we have save the in Array object here intially array is empty
// getItem and setItem are provided by local storage 

function saveStudentToStorage(student) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
}

// Delete student from localStorage
function deleteStudentFromStorage(id) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    // as i know filter print only true value object so if id match then it will make false , so it will delete student from array object
    students = students.filter(student => student.id !== id);
    localStorage.setItem('students', JSON.stringify(students));
}

// Edit student in localStorage
function editStudentInStorage(id, updatedStudent) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    // find index give first matched index 
    const studentIndex = students.findIndex(student => student.id === id);
    // -1 in JS means index not found means selected student object not found 
    if (studentIndex !== -1) {
        students[studentIndex] = updatedStudent;
        localStorage.setItem('students', JSON.stringify(students));
    }
}

// Load students from localStorage and display them on page load
function loadStudentsFromStorage() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.forEach(student => addStudentToDOM(student));
}

// i use JSON.stringify because local storage.setItem takes string as second parameter so i convert object into string 
// for use i can convert Object back into its original form using Json parse 