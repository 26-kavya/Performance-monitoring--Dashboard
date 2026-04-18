const axios = require('axios');

async function testMassiveUpload() {
    const students = Array.from({ length: 100000 }, (_, i) => ({
        name: `Massive Student ${i}`,
        email: `massive${i}@example.com`,
        gpa: 3.5,
        attendance: 90,
        department: 'Engineering',
        marks: { Maths: 90, Science: 85 }
    }));

    try {
        console.log("Sending...");
        const response = await axios.post('http://localhost:5000/api/students/bulk', students, { maxContentLength: Infinity, maxBodyLength: Infinity });
        console.log('Success:', response.status);
    } catch (error) {
        console.log('Error:', error.message);
    }
}

testMassiveUpload();
