import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { marked } from 'marked';
import TurndownService from 'turndown';



export class Home {
	public message = 'Hello World!';
	private quill: Quill;


	private turndownService = new TurndownService(
		{ bulletListMarker: '-' }
	);
	private markdownContent: string | Promise<string> = "";
	private rawMarkdown: string = "";

	private showMarkdownAsHtml = false;
	private showRawMarkdown = false;

	attached() {
		this.initQuill();
		this.customizeTurndown();
	}

	toggleMarkdownAsHtml(): void {
		this.showMarkdownAsHtml = !this.showMarkdownAsHtml;
	}

	toggleRawMarkdown(): void {
		this.showRawMarkdown = !this.showRawMarkdown;
	}

	convertToMarkdown() {
		const quillContent = this.quill.root.innerHTML;
		console.log('Quill HTML content:', quillContent);

		const convertQuillList = (listElement: HTMLElement): string => {
			let markdown = '';
			const listItems = listElement.children;

			for (let i = 0; i < listItems.length; i++) {
				const item = listItems[i] as HTMLLIElement;
				const indentLevel = parseInt(item.className.match(/ql-indent-(\d+)/)?.[1] || '0');
				const bullet = item.getAttribute('data-list') === 'bullet' ? '-' : `${i + 1}.`;
				const indent = '    '.repeat(indentLevel);

				let itemContent = this.turndownService.turndown(item.innerHTML).trim();
				itemContent = itemContent.replace(/^[-*+] /, '');

				markdown += `${indent}${bullet} ${itemContent}\n`;
			}

			return markdown;
		};

		const convertQuillContent = (content: string): string => {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = content;

			let markdown = '';

			tempDiv.childNodes.forEach((node) => {
				if (node.nodeName === 'OL' || node.nodeName === 'UL') {
					markdown += convertQuillList(node as HTMLElement);
					markdown += '\n';
				} else if (node.nodeName.match(/^H[1-6]$/)) {
					const headerLevel = node.nodeName[1];
					const headerContent = node.textContent || '';
					markdown += '#'.repeat(parseInt(headerLevel)) + ' ' + headerContent + '\n\n';
				} else if (node instanceof Element) {
					markdown += this.turndownService.turndown(node.outerHTML) + '\n';
				} else if (node instanceof Text) {
					markdown += this.turndownService.turndown(node.textContent || '') + '\n';
				}
			});

			return markdown.trim();
		};

		this.rawMarkdown = convertQuillContent(quillContent);
		console.log('Processed Markdown:', this.rawMarkdown);

		this.markdownContent = marked(this.rawMarkdown);
		this.showMarkdownAsHtml = true;
	}

	initQuill() {
		this.quill = new Quill('#rich-text-input', {
			theme: 'snow',
			modules: {
				toolbar: true
			}
		});
	}

	customizeTurndown() {
		this.turndownService.addRule('listItem', {
			filter: 'li',
			replacement: function (content, node, options) {
				content = content
					.replace(/^\n+/, '')
					.replace(/\n+$/, '\n')
					.replace(/\n/gm, '\n    ');
				let prefix = options.bulletListMarker + ' ';
				const parent = node.parentNode;
				if (parent.nodeName === 'OL') {
					const start = parent.getAttribute('start');
					const index = Array.prototype.indexOf.call(parent.children, node);
					prefix = (start ? Number(start) + index : index + 1) + '. ';
				}
				return prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '');
			}
		});

		this.turndownService.addRule('list', {
			filter: ['ul', 'ol'],
			replacement: function (content, node) {
				const parent = node.parentNode;
				if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
					return '\n' + content;
				} else {
					return '\n\n' + content + '\n\n';
				}
			}
		});

		console.log('Rules added to Turndown');
	}

}