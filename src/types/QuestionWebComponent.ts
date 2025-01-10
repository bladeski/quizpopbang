export default class QuestionWebComponent extends HTMLElement {
  static get observedAttributes() {
    return [
      'questionid',
      'readonly',
      'question',
      'imageurl',
      'forkids'
    ];
  }
  constructor(templateId: string) {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    this.shadowRoot?.appendChild(
      template.content.cloneNode(true)
    );
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'questionid':
        this.updateQuestionId(newValue);
        break;
      case 'readonly':
        this.updateReadonly(newValue);
        break;
      case 'question':
        this.updateQuestion(newValue);
        break;
      case 'imageurl':
        this.updateImageUrl(newValue);
        break;
      case 'forkids':
        this.updateForKids(newValue);
        break;

      default:
        break;
    }
  }

  updateQuestionId(value: string) {
    this.id = value;
    (this.shadowRoot?.querySelector('input') as HTMLInputElement).id = 'answer_' + value;
    (this.shadowRoot?.querySelector('label') as HTMLLabelElement).htmlFor = 'answer_' + value;     
  }

  updateReadonly(value: string) {
    if (value === 'true') {
      (this.shadowRoot?.querySelector('input') as HTMLInputElement).style.display = 'none';
      (this.shadowRoot?.querySelector('button') as HTMLInputElement).style.display = 'none';
    }
  }

  updateQuestion(value: string) {
    (this.shadowRoot?.querySelector('.question span') as HTMLSpanElement).textContent = value;
  }

  updateImageUrl(value: string) {
    (this.shadowRoot?.querySelector('img') as HTMLImageElement).src = value;
  }

  updateForKids(value: string) {
    if (value === 'true') {
      (this.shadowRoot?.querySelector('.question-wrapper') as HTMLLabelElement).classList.add('for-kids');
    }
  }
}