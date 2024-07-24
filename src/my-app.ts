import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { marked } from 'marked';
import TurndownService from 'turndown';
import { IWorkbookData, IWorksheetData, LocaleType, Tools, Univer, UniverInstanceType } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";

import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";

import { UniverUIPlugin } from "@univerjs/ui";

import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";

import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";

// import DesignEnUS from '@univerjs/design/locale/en-US';
import DesignEnUS from '@univerjs/design/lib/locale/en-US.json';
import UIEnUS from '@univerjs/ui/lib/locale/en-US.json';
import DocsUIEnUS from '@univerjs/docs-ui/lib/locale/en-US.json';
import SheetsEnUS from '@univerjs/sheets/lib/locale/en-US.json';
import SheetsUIEnUS from '@univerjs/sheets-ui/lib/locale/en-US.json';


export class MyApp {
	public message = 'Hello World!';
	private quill: Quill;

	private univerContainer: HTMLElement;
	private univerSheet: HTMLElement;

	private turndownService = new TurndownService();
	private markdownContent: string | Promise<string> = "";
	private rawMarkdown: string = "";


	attached() {
		this.initQuill();
		this.initUniver();


	}

	convertToMarkdown() {
		const quillContent = this.quill.root.innerHTML;
		this.rawMarkdown = this.turndownService.turndown(quillContent);
		this.markdownContent = marked(this.rawMarkdown);
	}

	initQuill() {
		this.quill = new Quill('#rich-text-input', {
			theme: 'snow',
			modules: {
				toolbar: true
			}
		});
	}

	initUniver() {

		this.univerContainer = document.getElementById('univer-container');
		this.univerSheet = document.getElementById('univer-sheet');

		const univer = new Univer({
			theme: defaultTheme,
			locale: LocaleType.EN_US,
			locales: {
				[LocaleType.EN_US]: Tools.deepMerge(
					SheetsEnUS,
					DocsUIEnUS,
					SheetsUIEnUS,
					UIEnUS,
					DesignEnUS,
				),
			},
		});

		univer.registerPlugin(UniverRenderEnginePlugin);
		univer.registerPlugin(UniverFormulaEnginePlugin);

		univer.registerPlugin(UniverUIPlugin, {
			container: this.univerContainer,
			// header: true,
			// footer: true,
		});

		univer.registerPlugin(UniverDocsPlugin, {
			hasScroll: false,
		});
		univer.registerPlugin(UniverDocsUIPlugin);

		univer.registerPlugin(UniverSheetsPlugin);
		univer.registerPlugin(UniverSheetsUIPlugin);
		univer.registerPlugin(UniverSheetsFormulaPlugin);


		univer.createUniverSheet(this.univerSheet);

	}
}