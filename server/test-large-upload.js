const axios = require('axios');

async function testLargeUpload() {
    const students = Array.from({ length: 2000 }, (_, i) => ({
        name: `Test Student ${i}`,
        email: `test${i}@example.com`,
        gpa: 3.5,
        attendance: 90,
        department: 'Computer Science',
        marks: { Maths: 90, Science: 85 }
    }));

    try {
        const response = await axios.post('http://localhost:5000/api/students/bulk', students);
        console.log('Success:', response.status);
    } catch (error) {
        console.log('Error:', error.message);
        if (error.response) {
            console.log('Response Status:', error.response.status);
            console.log('Response Data:', error.response.data);
        }
    }
}

testLargeUpload();
