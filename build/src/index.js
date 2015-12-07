'use strict';

const TPL_DIR  = `${__dirname}/../tpls`;
const POST_DIR = `${__dirname}/../posts`;
const PAGE_DIR = `${__dirname}/../pages`;
const WWW_DIR = `${__dirname}/../www`;

var polyfill = require('babel-polyfill');
var bluebird = require('bluebird');
var fs       = bluebird.promisifyAll(require("fs"));
var jade     = require('jade');
var marked   = require('marked');
var minify   = require('html-minifier').minify;

/**
 * entry point of the build process
 */
module.exports = async function run() {

    try {
        //build posts
        let files = await fs.readdirAsync(POST_DIR);
        let posts = await Promise.all(files.map(async file => await parsePost(file)));
        posts = posts.filter(post => !!post);
        await Promise.all(posts.map(async post => await generatePost(post)));

        //build index
        await generateIndex(posts);

        //build pages
        files = await fs.readdirAsync(PAGE_DIR);
        let pages = await Promise.all(files.map(async file => await parsePage(file)));
        pages = pages.filter(page => !!page);
        await Promise.all(pages.map(async page => await generatePage(page)));

        //build sitemap
        await generateSitemap(posts, pages);

        console.log('done!');
    } catch (ex) {
        console.error(ex);
    }

};

/**
 * generate index
 */
async function generateIndex(posts) {
    console.log('start index page')
    let html = jade.renderFile(`${TPL_DIR}/index.jade`, {posts});
    await writeHTMLFile(`${WWW_DIR}/index.html`, html);
    console.log('index page generated.');
}

/**
 * generate sitemap
 */
async function generateSitemap(posts, pages) {
    console.log('start sitemap')
    let xml = jade.renderFile(`${TPL_DIR}/sitemap.jade`, {posts, pages});
    await writeHTMLFile(`${WWW_DIR}/sitemap.xml`, xml, true);
    console.log('sitemap generated.');
}

/**
 * generate post
 */
async function generatePost(post) {
    let html = jade.renderFile(`${TPL_DIR}/post.jade`, post);
    await writeHTMLFile(`${WWW_DIR}/${post.name}.html`, html);
    console.log(`post "${post.name}" generated.`);
}

/**
 * generate page
 */
async function generatePage(page) {
    let html = jade.renderFile(`${TPL_DIR}/page.jade`, page);
    await writeHTMLFile(`${WWW_DIR}/${page.name}.html`, html);
    console.log(`page "${page.name}" generated.`);
}

/**
 * write html file
 */
async function writeHTMLFile(file, html, pretty) {
    if (!pretty) {
        html = minify(html, {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true
        });
    }
    await fs.writeFileAsync(file, html);
}

/**
 * parse page form markdown file
 */
async function parsePage(file) {
    //file name format: about-me.md
    let match = /^(.+)\.md$/i.exec(file);
    if (!match) {
        console.warn(`Name of file "${file}" is not valid!`);
        return;
    }
    var parsed =  await parseMdFile(`${PAGE_DIR}/${file}`);
    parsed.name = match[1];
    return parsed;
}

/**
 * parse post form markdown file
 */
async function parsePost(file) {
    //file name format: 2015-12-03-art-of-debugging.md
    let match = /^(\d{4}-\d\d-\d\d)-(.+)\.md$/i.exec(file);
    if (!match) {
        console.warn(`Name of file "${file}" is not valid!`);
        return;
    }
    var parsed =  await parseMdFile(`${POST_DIR}/${file}`);
    parsed.name = match[2];
    parsed.date = match[1];
    return parsed;
}

async function parseMdFile(file) {
    let rawContent = await fs.readFileAsync(file, 'utf-8');
    let {meta, content} = extractMeta(rawContent);
    return {
        title: meta.title,
        tags: meta.tags,
        content: marked(content),
        summary: marked(content.substring(0, 300).replace(/[\r\n]+/g, '')),
        meta
    }
}

/**
 * extract meta data from markdown content
 */
function extractMeta(md) {
    let metaText = '';
    let content = md.replace(/^(\w+:\s*.*[\r\n]+)*/, m => (metaText = m) && '');
    let meta = {};
    metaText.split(/[\r\n]+/).forEach(line => {
        let segs = line.split(/:\s*/);
        segs[0] && (meta[segs[0].toLowerCase()] = segs[1]);
    });
    return { meta, content };
}


