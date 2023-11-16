class MealRecommend extends HTMLElement {
    constructor() {
        super()
        
        this.name = this.getAttribute('name')
        this.meal_image = this.getAttribute('meal_image')
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
        <article class="meal_recommend">
            <img class="meal_image" src="${this.meal_image}">
            <div id="info_card">
                <h1 class="meal_title">${this.name}</h1>
                <h3 class="category_style">${this.category}</h3>
                <h4 class="meal_area">${this.area}</h4>
                <p>${this.description}</p>
            </div>
        </article>`;
    }
    
}

customElements.define('meal-recommend', MealRecommend)
export default MealRecommend;