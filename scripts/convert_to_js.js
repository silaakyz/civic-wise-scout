import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const distDir = path.join(projectRoot, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

function getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

function transpileFile(filePath) {
    let sourceCode = fs.readFileSync(filePath, 'utf-8');

    // Remove CSS imports
    sourceCode = sourceCode.replace(/^import\s+['"].*\.css['"];?$/gm, '');

    // Replace import.meta.env with window.env
    sourceCode = sourceCode.replace(/import\.meta\.env/g, 'window.env');

    // Transpile using TypeScript
    const result = ts.transpileModule(sourceCode, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2020,
            jsx: ts.JsxEmit.ReactJSX, // Use new JSX transform
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            esModuleInterop: true,
        }
    });

    let jsCode = result.outputText;

    // Rewrite imports to add .js extension
    jsCode = jsCode.replace(/(import|export)\s+(?:.+?\s+from\s+)?['"](\.{1,2}\/[^'"]+)['"]/g, (match, p1, p2) => {
        if (p2.endsWith('.css') || p2.endsWith('.scss')) return '';

        let importPath = p2.replace(/\.tsx?$/, '');

        // Check for index files
        try {
            const possibleDir = path.resolve(path.dirname(filePath), importPath);
            if (fs.existsSync(possibleDir) && fs.statSync(possibleDir).isDirectory()) {
                if (fs.existsSync(path.join(possibleDir, 'index.ts')) || fs.existsSync(path.join(possibleDir, 'index.tsx'))) {
                    return match.replace(p2, importPath + '/index.js');
                }
            }
        } catch (e) { }

        return match.replace(p2, importPath + '.js');
    });

    // Handle "@/..." alias using path.relative
    jsCode = jsCode.replace(/(import|export)\s+(?:.+?\s+from\s+)?['"]@\/([^'"]+)['"]/g, (match, p1, p2) => {

        // Remove TS extension from target path if present
        let targetRelativePath = p2.replace(/\.tsx?$/, '');

        // Resolve absolute path to target
        const absoluteTarget = path.join(srcDir, targetRelativePath);

        // Check if target is a directory index
        let suffix = '.js';
        try {
            if (fs.existsSync(absoluteTarget) && fs.statSync(absoluteTarget).isDirectory()) {
                suffix = '/index.js';
            }
        } catch (e) { }

        // Calculate relative path from current file to target
        let relativePath = path.relative(path.dirname(filePath), absoluteTarget);

        // Normalize path separators to forward slash
        relativePath = relativePath.split(path.sep).join('/');

        // Add ./ if it's a sibling or child
        if (!relativePath.startsWith('.')) {
            relativePath = './' + relativePath;
        }

        return match.replace(`@/${p2}`, relativePath + suffix);
    });

    // Save
    const relativePath = path.relative(srcDir, filePath);
    const destPath = path.join(distDir, relativePath.replace(/\.tsx?$/, '.js'));

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, jsCode);
    console.log(`Converted: ${relativePath} -> ${path.relative(projectRoot, destPath)}`);
}

const files = getAllFiles(srcDir);
files.forEach(transpileFile);

const publicDir = path.join(projectRoot, 'public');
if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, distDir, { recursive: true });
}

console.log('Conversion complete.');
