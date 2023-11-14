class IngredientCard extends HTMLElement {
    constructor() {
        super()
        
        this.name = this.getAttribute('name')
        this.ingrd_image = this.getAttribute('meal_image')
        this.description = this.getAttribute('description')
        this.category = this.getAttribute('category')
        this.area = this.getAttribute('area')
    }

    async getData(){
        const response = await fetch('https://www.themealdb.com/api.php');
        const result = await response.json();
        const data = await result;
        console.log(data)
    }

    static get observedAttributes() {
        return ['name', 'meal_image', 'description', 'category', 'area']
    }

    connectedCallback() {
        this.render()
    }
    
    attributeChangedCallback(propName, oldValue, newValue) {
        this[propName] = newValue
        this.render
    }

    render() {
        this.innerHTML=`
        <article class="ingrd">
        <div id="info_card">
            <img class="ingrd_image" src="${this.ingrd_image}">
            <div id="tags">
                <h4 class="category_style">${this.category}</h4>
                <label class="container">
                    <input type="radio" checked="checked" name="radio">
                    <span class="checkmark"></span>
                </label>
            </div>
        </div>
        </article>`;
    }
    
}

customElements.define('ingredient-card', IngredientCard)
export default IngredientCard;