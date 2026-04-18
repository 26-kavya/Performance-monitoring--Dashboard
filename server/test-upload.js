const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Create a dummy image file
const dummyImagePath = path.join(__dirname, 'test-image.png');
// minimal 1x1 png
const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync(dummyImagePath, pngBuffer);

async function testUpload() {
    console.log('Testing upload...');
    const form = new FormData();
    form.append('image', fs.createReadStream(dummyImagePath));

    try {
        const response = await axios.post('http://localhost:5000/api/upload', form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('Upload successful:', response.data);
    } catch (error) {
        console.error('Upload failed:', error.response ? error.response.data : error.message);
    } finally {
        fs.unlinkSync(dummyImagePath);
    }
}

// Give server a moment to start
setTimeout(testUpload, 2000);
