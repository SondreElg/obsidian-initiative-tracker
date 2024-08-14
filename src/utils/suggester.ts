import type { FuzzyMatch } from "obsidian";
import { FuzzyInputSuggest } from "obsidian-utilities";

import type { HomebrewCreature } from "src/types/creatures";
import type { SRDMonster } from "src/types/creatures";
import type { Creature } from "./creature";

export class SRDMonsterSuggestionModal extends FuzzyInputSuggest<
    HomebrewCreature | SRDMonster
> {
    renderNote(
        noteEL: HTMLElement,
        result: FuzzyMatch<HomebrewCreature | SRDMonster>
    ): void {
        noteEL.setText([result.item.source].flat().join(", "));
    }
    renderTitle(
        titleEl: HTMLElement,
        result: FuzzyMatch<HomebrewCreature | SRDMonster>
    ): void {
        this.renderMatches(titleEl, result.item.name, result.match.matches);
    }
    getItemText(item: HomebrewCreature | SRDMonster) {
        return item.name;
    }
}
// export class ConditionSuggestionModal extends SuggestionModal<string> {
//     condition: string;
//     constructor(public items: string[], inputEl: HTMLInputElement) {
//         super(app, inputEl);
//         this.suggestEl.style.removeProperty("min-width");
//         this.onInputChanged();
export class ConditionSuggestionModal extends FuzzyInputSuggest<string> {
    renderNote(noteEL: HTMLElement, result: FuzzyMatch<string>): void {}
    renderTitle(titleEl: HTMLElement, result: FuzzyMatch<string>): void {
        this.renderMatches(titleEl, result.item, result.match.matches);
    }
    getItemText(item: string) {
        return item;
    }
    getItems() {
        return this.items;
    }
    onChooseItem(item: string) {
        this.inputEl.value = item;
        this.condition = item;
    }
    onInputChanged(): void {
        const inputStr = this.modifyInput(this.inputEl.value);
        const suggestions = this.getSuggestions(inputStr);

        if (inputStr) {
            const improvCondition: FuzzyMatch<string> = {
                match: {
                    matches: [[1, this.inputEl.value.length + 1]],
                    score: 1
                },
                item: this.inputEl.value
            }
            this.suggester.setSuggestions([...suggestions.slice(0, this.limit - 1), improvCondition]);
        }
        else if (suggestions.length > 0) {
            this.suggester.setSuggestions(suggestions.slice(0, this.limit));
        }
        else {
            this.onNoSuggestion();
        }
        this.open();
    }
    onNoSuggestion() {
        this.empty();
        this.renderSuggestion(
            null,
            this.contentEl.createDiv("suggestion-item")
        );
    }
    selectSuggestion({ item }: FuzzyMatch<string>) {
        if (this.condition !== null) {
            this.inputEl.value = item;
            this.condition = item;
        } else {
            this.condition = null;
        }

        this.onClose();
        this.close();
    }
    renderSuggestion(result: FuzzyMatch<string>, el: HTMLElement) {
        let { item, match: matches } = result || {};
        let content = new Setting(el); /* el.createDiv({
            cls: "suggestion-content"
        }); */
        if (!item) {
            content.nameEl.setText(this.emptyStateText);
            this.condition = null;
            return;
        }

        const matchElements = matches.matches.map((m) => {
            return createSpan("suggestion-highlight");
        });
        for (let i = 0; i < item.length; i++) {
            let match = matches.matches.find((m) => m[0] === i);
            if (matches.score == 1) {
                content.nameEl.appendText(`"${item}"`);
                break;
            }
            if (match) {
                let element = matchElements[matches.matches.indexOf(match)];
                content.nameEl.appendChild(element);
                element.appendText(item.substring(match[0], match[1]));

                i += match[1] - match[0] - 1;
                continue;
            }

            content.nameEl.appendText(item[i]);
        }
    }
}

export class PlayerSuggestionModal extends FuzzyInputSuggest<Creature> {
    renderNote(noteEL: HTMLElement, result: FuzzyMatch<Creature>): void {}
    renderTitle(titleEl: HTMLElement, result: FuzzyMatch<Creature>): void {
        this.renderMatches(titleEl, result.item.name, result.match.matches);
    }
    getItemText(item: Creature) {
        return item.name;
    }
}
