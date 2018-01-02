
export class CategoriesService {
    listOfCategories : String[] = ['All', 'Favorite'];

    addCategory(category: string) {
        this.listOfCategories.push(category);
    }

    removeCategory(category: string, index: number) {
        this.listOfCategories.slice(index, 1);
    }

    getCategories() {
        return this.listOfCategories;
    }
}