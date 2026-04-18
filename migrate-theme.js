const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try {
            filelist = walkSync(dirFile, filelist);
        } catch (err) {
            if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
        }
    });
    return filelist;
};

const srcDir = path.join(__dirname, 'src');
const files = walkSync(srcDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/\bbg-white\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'bg-white dark:bg-[#1e1e1e] dark:border-[#333333]');
    content = content.replace(/\bbg-slate-50\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'bg-slate-50 dark:bg-[#121212]');
    content = content.replace(/\bbg-slate-100\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'bg-slate-100 dark:bg-[#2a2a2a]');

    content = content.replace(/\btext-slate-800\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'text-slate-800 dark:text-[#e0e0e0]');
    content = content.replace(/\btext-slate-900\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'text-slate-900 dark:text-[#e0e0e0]');
    content = content.replace(/\btext-slate-700\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'text-slate-700 dark:text-[#e0e0e0]');
    content = content.replace(/\btext-slate-600\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'text-slate-600 dark:text-[#a0aec0]');
    content = content.replace(/\btext-slate-500\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'text-slate-500 dark:text-[#a0aec0]');

    content = content.replace(/\bborder-slate-100\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'border-slate-100 dark:border-[#333]');
    content = content.replace(/\bborder-slate-200\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'border-slate-200 dark:border-[#333]');
    
    content = content.replace(/\bdivide-slate-100\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'divide-slate-100 dark:divide-[#333]');
    content = content.replace(/\bdivide-slate-200\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'divide-slate-200 dark:divide-[#333]');

    content = content.replace(/\btext-indigo-600\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'text-indigo-600 dark:text-indigo-400');
    content = content.replace(/\btext-indigo-700\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'text-indigo-700 dark:text-indigo-300');
    content = content.replace(/\bbg-indigo-600\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'bg-indigo-600 dark:bg-indigo-500');
    content = content.replace(/\bbg-indigo-50\b(?!\/)(?![A-Za-z0-9_-])(?!\s*dark:)/g, 'bg-indigo-50 dark:bg-indigo-900/30');
    
    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${path.basename(file)}`);
    }
});
