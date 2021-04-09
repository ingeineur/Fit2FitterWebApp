import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Image, List, Search, Dropdown, Menu, Segment, Label, Divider } from 'semantic-ui-react'
import { isNullOrUndefined } from 'util';
import { IMealDto, IMealDetails, IRecipeDto, IRecipeItemDto } from '../models/meals';
import { IClientDto } from '../models/clients';

interface IProps {
    client: IClientDto;
    update: boolean;
    addMeal: Function;
}

interface IFoodLegacyDto {
    fdcId: string,
    description: string
}

interface IMealDesc {
    id: string,
    description: string
}

interface IFoodPortionDto {
    fdcId: string,
    modifier: string,
    amount: number,
    gramWeight: number,
    proteinValue: number,
    fatValue: number,
    carbValue: number,
}

interface IOption {
    key: string,
    text: string,
    value: string
}

interface IState {
    meal: IMealDetails;
    meals: IMealDetails[];
    dirty: boolean;
    updated: boolean;
    status: string,
    loading: boolean,
    searchResults: IFoodLegacyDto[],
    searchText: string,
    selectedValue: string,
    portions: IOption[],
    selectedPortion: string,
    foodPortionDtos: IFoodPortionDto[],
    apiUpdated: boolean,
    usdaQuantity: number,
    selectedFdcId: string,
    usdaUpdated: boolean,
    imageUploadStatus: string,
    searchFoodResults: IMealDto[],
    dropDownString: IMealDesc[],
    searchFoodText: string,
    selectedFoodValue: string,
    activeItem: string;
    anzQuantity: number,
    selectedFdcIdAnz: string,
    anzUpdated: boolean,
    loadingAnz: boolean,
    searchResultsAnz: IFoodLegacyDto[],
    searchTextAnz: string,
    selectedValueAnz: string,
    portionsAnz: IOption[],
    selectedPortionAnz: string,
    foodPortionDtosAnz: IFoodPortionDto[],
    apiUpdatedAnz: boolean,
    searchedRecipeDtos: IRecipeDto[];
    recipeDto: IRecipeDto;
    recipeQuantity: number,
    recipeUpdated: boolean,
    selectedPortionRecipe: string,
    foodPortionDtosRecipe: IFoodPortionDto[],
    portionsRecipe: IOption[],
    apiUpdatedRecipe: boolean,
}

var divFoodLogoStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

class MacroGuideModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            meal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false, photo:'' },
            updated: false, meals: [], status: 'Ready', loading: false, searchResults: [], selectedValue: 'No Selection',
            portions: [], selectedPortion: '', apiUpdated: false, foodPortionDtos: [], usdaQuantity: 1.0,
            searchText: '', selectedFdcId: '', usdaUpdated: false, imageUploadStatus: 'No Image', searchFoodResults: [],
            searchFoodText: '', selectedFoodValue: '', dropDownString: [], activeItem: 'Recipes',
            loadingAnz: false, searchResultsAnz: [], selectedValueAnz: 'No Selection',
            portionsAnz: [], selectedPortionAnz: '', foodPortionDtosAnz: [], anzQuantity: 1.0, selectedFdcIdAnz: '', searchTextAnz: '',
            anzUpdated: false, apiUpdatedAnz: false, searchedRecipeDtos: [],
            recipeDto: { id: 0, name: '', carbs: 0, protein: 0, fat: 0, serving: 0, photo: '', updated: '', created: '', clientId: 0 },
            recipeQuantity: 1, recipeUpdated: false, selectedPortionRecipe: '', foodPortionDtosRecipe: [],
            portionsRecipe: [], apiUpdatedRecipe: false
        };
    }

    getDivLabelStyle2 = () => {
        return ({
            color: 'black'
        });
    }

    getDivLabelStyle3 = () => {
        return ({
            color: 'red'
        });
    }

    getDivLabelStyle = () => {
        return ({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getColour()
        });
    }

    getDivUploadImageStyle = () => {
        return ({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getUploadImageColour()
        });
    }

    public componentDidMount() {
    }

    updateFood = (event: any) => {
        this.state.meal.food = event.target.value;
        this.setState({ meal: this.state.meal, status: 'Pending add to the list' });
    }

    updateCarb = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.carb = event.target.value;
            this.setState({ meal: this.state.meal, updated: true, status: 'Pending add to the list' });
        }
    }

    updateProtein = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.protein = event.target.value;
            this.setState({ meal: this.state.meal, updated: true, status: 'Pending add to the list' });
        }
    }

    updateFat = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.fat = event.target.value;
            this.setState({ meal: this.state.meal, updated: true, status: 'Pending add to the list' });
        }
    }

    updateFv = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.fv = event.target.value;
            this.setState({ meal: this.state.meal, updated: true, status: 'Pending add to the list' });
        }
    }

    addMeal = () => {
        if (this.state.meal.food.trim().length < 1) {
            this.setState({ status: 'Error: No Food Description' });
            return;
        }

        this.setState({ status: 'Added to list' });
        this.state.meals.push({ id: 0, food: this.state.meal.food, carb: this.state.meal.carb, protein: this.state.meal.protein, fat: this.state.meal.fat, fv: this.state.meal.fv, check: this.state.meal.check, remove: this.state.meal.remove, photo: this.state.meal.photo });
        this.setState({ meals: this.state.meals, updated: true, imageUploadStatus: 'No Image' })
        this.setState({ meal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false, photo: '' } });
    }

    updateUsdaQuantity = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ usdaQuantity: event.target.value, usdaUpdated: true });
        }
    }

    updateAnzQuantity = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ anzQuantity: event.target.value, anzUpdated: true });
        }
    }

    updateRecipeQuantity = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ recipeQuantity: event.target.value, recipeUpdated: true });
        }
    }

    removeLastAddedMeal = () => {
        if (this.state.meals.length > 0) {
            this.state.meals.pop();
            this.setState({ meals: this.state.meals, updated: true })
        }
    }

    getItems = () => {
        if (this.state.meals.length < 1) {
            return (<List.Item key={0}>
                - EMPTY -
                </List.Item>);
        }

        console.log(this.state.meals);

        return (
            this.state.meals.map((item, index) =>
                <List.Item key={index}>
                    {item.food} - carb: {item.carb}g protein: {item.protein}g fat: {item.fat}g fruits/vegs: {item.fv} serving(s)
                </List.Item>
            ));
    }

    getColour = () => {
        if (this.state.status.includes('Error')) {
            return 'red';
        }

        if (this.state.status.includes('Pending')) {
            return 'orange';
        }

        if (this.state.status.includes('Updating')) {
            return 'red';
        }

        return 'green';
    }

    getUploadImageColour = () => {
        if (this.state.imageUploadStatus.includes('Uploading')) {
            return 'orange';
        }

        if (this.state.imageUploadStatus.includes('No Image')) {
            return 'black';
        }

        return 'green';
    }

    handleSearchChange = (e: any, data: any) => {
        this.setState({ loading: true });

        fetch('api/food/' + data['value'] + '/foods')
            .then(response => response.json() as Promise<IFoodLegacyDto[]>)
            .then(data => this.setState({
                searchResults: data, loading: false
            })).catch(error => console.log(error))

        this.setState({ searchText: data['value'] });
    }

    handleSelectResult = (e: any, data: any) => {
        this.setState({ status: 'Updating Data From USDA.......' });
        var sel = data['result'];
        if (!isNullOrUndefined(sel)) {
            this.setState({ selectedValue: sel['description'] });
            var fdcId = sel['fdcId'];
            
            fetch('api/food/' + fdcId + '/food/portions')
                .then(response => response.json() as Promise<IFoodPortionDto[]>)
                .then(data => this.setState({
                    foodPortionDtos: data, apiUpdated: true, portions: [], usdaQuantity: 1.0, selectedFdcId: fdcId
                })).catch(error => console.log(error))
        }
    }

    handleFoodSearchChange = (e: any, data: any) => {
        this.setState({ loading: true });
        fetch('api/tracker/' + this.props.client.id + '/macrosguide/search?keyword=' + data['value'])
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => {
                let results: IMealDesc[] = [];
                data.forEach(x => results.push({ id: x.id.toString(), description: x.food }));
                this.setState({
                    searchFoodResults: data, loading: false, dropDownString: results
                })
            }).catch(error => console.log(error));

        this.setState({ searchFoodText: data['value'] });
    }

    handleFoodSelectResult = (e: any, data: any) => {
        this.setState({ status: 'Updating Data .......' });
        var sel = data['result'];
        if (!isNullOrUndefined(sel)) {
            this.setState({ selectedFoodValue: sel['description'] });
            var id = sel['id'];
            var meal = this.state.searchFoodResults.find(x => x.id === parseInt(id));
            if (meal != null) {
                var imageUploadStatus = '';
                console.log(meal);
                if (meal.photo !== '') {
                    imageUploadStatus = 'Uploaded';
                }
                this.setState({
                    meal: {
                        id: 0, food: meal.food, carb: meal.carb, protein: meal.protein,
                        fat: meal.fat, fv: meal.fv, check: false, remove: false, photo: meal.photo
                    }, updated: true, imageUploadStatus: imageUploadStatus, status: 'Pending add to the list'
                });
            }
        }
    }

    handleSelectPortion = (event: any, data: any) => {
        this.setState({ usdaUpdated: true, selectedPortion: data['value'] });
    }

    addUsda = () => {
        this.state.meal.food = this.state.selectedValue;
        if (this.state.portions.length > 0 && this.state.foodPortionDtos.length > 0) {
            this.state.foodPortionDtos.forEach(x => {
                if (x.modifier === this.state.selectedPortion) {
                    this.state.meal.carb = parseFloat((this.state.usdaQuantity * x.carbValue * x.gramWeight).toFixed(2));
                    this.state.meal.protein = parseFloat((this.state.usdaQuantity * x.proteinValue * x.gramWeight).toFixed(2));
                    this.state.meal.fat = parseFloat((this.state.usdaQuantity * x.fatValue * x.gramWeight).toFixed(2));
                    var totalWeight = this.state.usdaQuantity * x.gramWeight;
                    this.state.meal.food = this.state.selectedValue + ' (' + totalWeight.toFixed(2) + 'g)';
                }
            });
        }
        else {
            this.state.meal.carb = 0.0;
            this.state.meal.protein = 0.0;
            this.state.meal.fat = 0.0;
            this.state.meal.fv = this.state.usdaQuantity;
        }

        this.setState({ meal: this.state.meal, status: 'Pending add to the list', updated: true });
    }

    handleImageChange = (event: any) => {
        const formData = new FormData()
        formData.append('Filename', event.target.files[0]['name'])
        formData.append('FormFile', event.target.files[0])
        this.setState({ imageUploadStatus: 'Uploading..' });
        fetch('api/Utilities/image/meal/upload',
            {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(uploadedFilename => {
                console.log(uploadedFilename)
                this.state.meal.photo = uploadedFilename;
                this.setState({ meal: this.state.meal, updated: true, imageUploadStatus: 'Uploaded' });
            })
            .catch(error => {
                console.error(error)
            })
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    getUsda = () => {
        return (<Segment attached='bottom'>
            <div style={divFoodLogoStyle}>
                <Image circular size='tiny' src='USDALogo.jfif' href='https://www.usda.gov/topics/food-and-nutrition' target='_blank' />
            </div>
            <Grid centered>
                <Grid.Row stretched textAlign='left'>
                    <Grid.Column textAlign='center' width={16}>
                        <Search
                            fluid
                            size='small'
                            loading={this.state.loading}
                            onSearchChange={this.handleSearchChange}
                            onResultSelect={this.handleSelectResult}
                            results={this.state.searchResults}
                            value={this.state.searchText}
                        />
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' as='a' width={16} textAlign='center'>
                        <div style={this.getDivLabelStyle3()}>
                            <a style={this.getDivLabelStyle3()} href={'https://fdc.nal.usda.gov/fdc-app.html#/food-details/' + this.state.selectedFdcId + '/nutrients'} target='_blank'>source link: {this.state.selectedValue}</a>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={16} textAlign='center'>
                        <Grid centered>
                            <Grid.Row columns={3} stretched textAlign='left'>
                                <Grid.Column width={4} textAlign='left'>
                                    <a style={this.getDivLabelStyle2()}>Quantity:</a>
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='left'>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left' floated='left'>
                                    <a style={this.getDivLabelStyle2()}>Portions:</a>
                                </Grid.Column>
                                <Grid.Column width={4} textAlign='left'>
                                    <Input size='small' value={this.state.usdaQuantity} onChange={this.updateUsdaQuantity} placeholder='Quantity' />
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='center'>
                                    <div style={this.getDivLabelStyle2()}>
                                        <h3>x</h3>
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left'>
                                    <Dropdown fluid id='portions' value={this.state.selectedPortion} selection options={this.state.portions} onChange={this.handleSelectPortion} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>);
    }

    handleSearchChangeAnz = (e: any, data: any) => {
        this.setState({ loadingAnz: true });

        fetch('api/food/' + data['value'] + '/anz/foods')
            .then(response => response.json() as Promise<IFoodLegacyDto[]>)
            .then(data => this.setState({
                searchResultsAnz: data, loadingAnz: false
            })).catch(error => console.log(error))

        this.setState({ searchTextAnz: data['value'] });
    }

    handleSelectResultAnz = (e: any, data: any) => {
        this.setState({ status: 'Updating Data From FSANZ.......' });
        var sel = data['result'];
        if (!isNullOrUndefined(sel)) {
            this.setState({ selectedValueAnz: sel['description'] });
            var fdcId = sel['fdcId'];

            fetch('api/food/' + fdcId + '/anz/food/portions')
                .then(response => response.json() as Promise<IFoodPortionDto[]>)
                .then(data => this.setState({
                    foodPortionDtosAnz: data, apiUpdatedAnz: true, portionsAnz: [], anzQuantity: 1.0, selectedFdcIdAnz: fdcId
                })).catch(error => console.log(error))
        }
    }

    handleSelectPortionAnz = (event: any, data: any) => {
        this.setState({ anzUpdated: true, selectedPortionAnz: data['value'] });
    }

    addAnz = () => {
        this.state.meal.food = this.state.selectedValueAnz;
        if (this.state.portionsAnz.length > 0 && this.state.foodPortionDtosAnz.length > 0) {
            this.state.foodPortionDtosAnz.forEach(x => {
                if (x.modifier === this.state.selectedPortionAnz) {
                    this.state.meal.carb = parseFloat((this.state.anzQuantity * x.carbValue * x.gramWeight).toFixed(2));
                    this.state.meal.protein = parseFloat((this.state.anzQuantity * x.proteinValue * x.gramWeight).toFixed(2));
                    this.state.meal.fat = parseFloat((this.state.anzQuantity * x.fatValue * x.gramWeight).toFixed(2));
                    var totalWeight = this.state.anzQuantity * x.gramWeight;
                    this.state.meal.food = this.state.selectedValueAnz + ' (' + totalWeight.toFixed(2) + 'g)';

                    if (x.modifier.includes('fruit')) {
                        this.state.meal.fv = this.state.anzQuantity;
                    }
                    else {
                        this.state.meal.fv = 0;
                    }
                }
            });
        }
        else {
            this.state.meal.carb = 0.0;
            this.state.meal.protein = 0.0;
            this.state.meal.fat = 0.0;
            this.state.meal.fv = this.state.anzQuantity;
        }

        this.setState({ meal: this.state.meal, status: 'Pending add to the list', updated: true });
    }

    getFsanz = () => {
        return (<Segment attached='bottom'>
            <div style={divFoodLogoStyle}>
                <Image circular size='small' src='FSANZLogo.jpg' href='https://www.foodstandards.gov.au/' target='_blank' />
            </div>
            <Grid centered>
                <Grid.Row stretched textAlign='left'>
                    <Grid.Column textAlign='center' width={16}>
                        <Search
                            fluid
                            size='small'
                            loading={this.state.loadingAnz}
                            onSearchChange={this.handleSearchChangeAnz}
                            onResultSelect={this.handleSelectResultAnz}
                            results={this.state.searchResultsAnz}
                            value={this.state.searchTextAnz}
                        />
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' as='a' width={16} textAlign='center'>
                        <div style={this.getDivLabelStyle3()}>
                            <a style={this.getDivLabelStyle3()} href={'https://www.foodstandards.gov.au/science/monitoringnutrients/afcd/Pages/fooddetails.aspx?PFKID=' + this.state.selectedFdcIdAnz} target='_blank'>source link: {this.state.selectedValueAnz}</a>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={16} textAlign='center'>
                        <Grid centered>
                            <Grid.Row columns={3} stretched textAlign='left'>
                                <Grid.Column width={4} textAlign='left'>
                                    <a style={this.getDivLabelStyle2()}>Quantity:</a>
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='left'>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left' floated='left'>
                                    <a style={this.getDivLabelStyle2()}>Meal Portions:</a>
                                </Grid.Column>
                                <Grid.Column width={4} textAlign='left'>
                                    <Input size='small' value={this.state.anzQuantity} onChange={this.updateAnzQuantity} placeholder='Quantity' />
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='center'>
                                    <div style={this.getDivLabelStyle2()}>
                                        <h3>x</h3>
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left'>
                                    <Dropdown fluid id='portions' value={this.state.selectedPortionAnz} selection options={this.state.portionsAnz} onChange={this.handleSelectPortionAnz} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>);
    }

    getSearchOption = () => {
        if (this.state.activeItem == 'USDA') {
            return this.getUsda();
        }
        else if (this.state.activeItem == 'prev') {
            return this.getOwnMealData();
        }
        else if (this.state.activeItem == 'ANZ') {
            return this.getFsanz();
        }
        else if (this.state.activeItem == 'Recipes') {
            return this.getRecipesSearch();
        }
    }

    getOwnMealData = () => {
        return (<Segment attached='bottom'>
            <Grid centered>
                <Grid.Row stretched textAlign='left'>
                    <Grid.Column textAlign='center' width={16}>
                        <div style={this.getDivLabelStyle3()}>
                            <a style={this.getDivLabelStyle3()}>Copy your own meals entered since last 5 days</a>
                        </div>
                        <Search
                            fluid
                            size='small'
                            loading={this.state.loading}
                            onSearchChange={this.handleFoodSearchChange}
                            onResultSelect={this.handleFoodSelectResult}
                            results={this.state.dropDownString}
                            value={this.state.searchFoodText}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>);
    }

    handleRecipeSelectResult = (e: any, data: any) => {
        this.setState({ status: 'Updating Recipe Data .......' });
        var sel = data['result'];
        if (!isNullOrUndefined(sel)) {
            this.setState({ selectedFoodValue: sel['description'] });
            var id = sel['id'];
            var recipe = this.state.searchedRecipeDtos.find(x => x.id === parseInt(id));
            if (recipe != null) {
                var imageUploadStatus = '';
                console.log(recipe);
                if (recipe.photo !== '') {
                    imageUploadStatus = 'Uploaded';
                }

                let portions: IFoodPortionDto[] = [];
                portions.push({
                    fdcId: recipe.id.toString(), modifier: 'One Serve', amount: 1, carbValue: recipe.carbs / 100.00,
                    proteinValue: recipe.protein / 100.00, fatValue: recipe.fat / 100.00, gramWeight: recipe.serving
                });

                portions.push({
                    fdcId: recipe.id.toString(), modifier: 'One Gram', amount: 1, carbValue: recipe.carbs / 100.00,
                    proteinValue: recipe.protein / 100.00, fatValue: recipe.fat / 100.00, gramWeight: 1
                });

                portions.push({
                    fdcId: recipe.id.toString(), modifier: 'One Hundred Gram', amount: 1, carbValue: recipe.carbs / 100.00,
                    proteinValue: recipe.protein / 100.00, fatValue: recipe.fat / 100.00, gramWeight: 100
                });

                this.setState({
                    recipeDto: recipe, updated: true,
                    imageUploadStatus: imageUploadStatus, 
                    status: 'Ready',
                    apiUpdatedRecipe: true,
                    foodPortionDtosRecipe: portions
                });
            }
        }
    }

    handleRecipeSearchChange = (e: any, data: any) => {
        this.setState({ loading: true });
        fetch('api/food/' + this.props.client.id + '/recipes/search?keyword=' + data['value'])
            .then(response => response.json() as Promise<IRecipeDto[]>)
            .then(data => {
                let results: IMealDesc[] = [];
                data.forEach(x => {
                    results.push({
                        id: x.id.toString(), description: x.name
                    });
                });
                this.setState({
                    searchedRecipeDtos: data, loading: false, dropDownString: results
                })
            }).catch(error => console.log(error));

        this.setState({ searchFoodText: data['value'] });
    }

    handleSelectPortionRecipe = (event: any, data: any) => {
        this.setState({ recipeUpdated: true, selectedPortionRecipe: data['value'] });
    }

    getRecipesSearch = () => {
        return (<Segment attached='bottom'>
            <Grid centered>
                <Grid.Row stretched textAlign='center'>
                    <Grid.Column textAlign='center' width={16}>
                        <div style={this.getDivLabelStyle()}>
                            {this.getPhoto()}
                        </div>
                    </Grid.Column>
                    <Grid.Column textAlign='center' width={16}>
                        <div style={this.getDivLabelStyle3()}>
                            <a style={this.getDivLabelStyle3()}>Search for your recipes</a>
                        </div>
                        <Search
                            fluid
                            size='small'
                            loading={this.state.loading}
                            onSearchChange={this.handleRecipeSearchChange}
                            onResultSelect={this.handleRecipeSelectResult}
                            results={this.state.dropDownString}
                            value={this.state.searchFoodText}
                        />
                    </Grid.Column>
                    <Grid.Column width={16} textAlign='center'>
                        <Grid centered>
                            <Grid.Row columns={3} stretched textAlign='left'>
                                <Grid.Column width={4} textAlign='left'>
                                    <a style={this.getDivLabelStyle2()}>Quantity:</a>
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='left'>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left' floated='left'>
                                    <a style={this.getDivLabelStyle2()}>Meal Portions:</a>
                                </Grid.Column>
                                <Grid.Column width={4} textAlign='left'>
                                    <Input size='small' value={this.state.recipeQuantity} onChange={this.updateRecipeQuantity} placeholder='Quantity' />
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='center'>
                                    <div style={this.getDivLabelStyle2()}>
                                        <h3>x</h3>
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign='left'>
                                    <Dropdown fluid id='portions' value={this.state.selectedPortionRecipe} selection options={this.state.portionsRecipe} onChange={this.handleSelectPortionRecipe} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>);
    }

    addRecipe = () => {
        this.state.meal.food = this.state.selectedFoodValue;
        if (this.state.portionsRecipe.length > 0 && this.state.foodPortionDtosRecipe.length > 0) {
            this.state.foodPortionDtosRecipe.forEach(x => {
                if (x.modifier === this.state.selectedPortionRecipe) {
                    this.state.meal.carb = parseFloat((this.state.recipeQuantity * x.carbValue * x.gramWeight).toFixed(2));
                    this.state.meal.protein = parseFloat((this.state.recipeQuantity * x.proteinValue * x.gramWeight).toFixed(2));
                    this.state.meal.fat = parseFloat((this.state.recipeQuantity * x.fatValue * x.gramWeight).toFixed(2));
                    var totalWeight = this.state.recipeQuantity * x.gramWeight;
                    this.state.meal.food = this.state.selectedFoodValue + ' (' + totalWeight.toFixed(2) + 'g)';
                    this.state.meal.photo = this.state.recipeDto.photo;
                }
            });
        }
        else {
            this.state.meal.carb = 0.0;
            this.state.meal.protein = 0.0;
            this.state.meal.fat = 0.0;
            this.state.meal.fv = 0;
        }

        this.setState({ meal: this.state.meal, status: 'Pending add to the list', updated: true });
    }

    getTableRows = () => {
        return (
            this.state.meals.map((item, index) =>
                <Grid.Row className={'row'} key={index} columns={5} stretched>
                    <Grid.Column className={'col_food'} key={index + 1} width={8}>
                        <a key={index + 1}>{item.food}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_carb'} key={index + 2} width={2}>
                        <a key={index + 2}>{parseFloat(item.carb.toString()).toFixed(2)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_protein'} key={index + 3} width={2}>
                        <a key={index + 3}>{parseFloat(item.protein.toString()).toFixed(2)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fat'} key={index + 4} width={2}>
                        <a key={index + 4}>{parseFloat(item.fat.toString()).toFixed(2)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fv'} key={index + 5} width={2}>
                        <a key={index + 5}>{item.fv}</a>
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    getRows = () => {
        var totalCarb = (this.state.meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
        var totalProtein = (this.state.meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
        var totalFat = (this.state.meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
        var totalFv = (this.state.meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));
        return (
            <div>
                <Segment textAlign='center' attached='bottom'>
                    <Grid centered>
                        <Grid.Row columns={6} textAlign='left' color='orange'>
                            <Grid.Column width={2}>
                            </Grid.Column>
                            <Grid.Column width={6} textAlign='left'>
                                <div><a>Item's Name</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>Ca(g)</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>Pro(g)</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>Fa(g)</a></div>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <div><a>FV</a></div>
                            </Grid.Column>
                        </Grid.Row>
                        {this.getTableRows()}
                        <Grid.Row textAlign='left' color='black' className={'row'} key={1} columns={5} stretched>
                            <Grid.Column className={'col_food'} key={1} width={8} textAlign='left'>
                                <a key={1}>Total Macros</a>
                            </Grid.Column>
                            <Grid.Column className={'col_carb'} key={2} width={2}>
                                <a key={2}>{totalCarb.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_protein'} key={3} width={2}>
                                <a key={3}>{totalProtein.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fat'} key={4} width={2}>
                                <a key={4}>{totalFat.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fv'} key={5} width={2}>
                                <a key={5}>{totalFv.toFixed(2)}</a>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }

    getPhoto = () => {
        if (this.state.recipeDto.photo != '' && this.state.activeItem == 'Recipes') {
            return (<Segment size='tiny' attached='top' textAlign='center'><Image src={'/images/meals/' + this.state.recipeDto.photo} size='small' /></Segment>);
        }
        return;
    }

    render() {

        if (this.state.dirty !== this.props.update) {
            while (this.state.meals.length > 0) {
                this.state.meals.pop();
            }
        }

        if (this.state.usdaUpdated === true) {
            this.setState({ usdaUpdated: false });
            this.addUsda();
        }

        if (this.state.anzUpdated === true) {
            this.setState({ anzUpdated: false });
            this.addAnz();
        }

        if (this.state.recipeUpdated === true) {
            this.setState({ recipeUpdated: false });
            this.addRecipe();
        }

        if (this.state.updated === true) {
            this.setState({ updated: false });
            this.props.addMeal(this.state.meals);
        }

        if (this.state.apiUpdated === true) {
            this.setState({ apiUpdated: false });
            
            this.state.foodPortionDtos.forEach(x => {
                this.state.portions.push({ key: x.modifier, value: x.modifier, text: x.amount + ' ' + x.modifier + ' (' + x.gramWeight + 'g)' });
            });

            if (this.state.foodPortionDtos.length > 0) {
                this.setState({ portions: this.state.portions, selectedPortion: this.state.foodPortionDtos[0].modifier });
            }

            this.setState({ usdaUpdated: true });
        }

        if (this.state.apiUpdatedAnz === true) {
            this.setState({ apiUpdatedAnz: false });

            this.state.foodPortionDtosAnz.forEach(x => {
                this.state.portionsAnz.push({ key: x.modifier, value: x.modifier, text: x.amount + ' ' + x.modifier + ' (' + x.gramWeight + 'g)' });
            });

            if (this.state.foodPortionDtosAnz.length > 0) {
                this.setState({ portionsAnz: this.state.portionsAnz, selectedPortionAnz: this.state.foodPortionDtosAnz[0].modifier });
            }

            this.setState({ anzUpdated: true });
        }

        if (this.state.apiUpdatedRecipe === true) {
            if (this.state.portionsRecipe.length < 1 && this.state.foodPortionDtosRecipe.length > 0) {
                this.state.foodPortionDtosRecipe.forEach(x => {
                    this.state.portionsRecipe.push({ key: x.modifier, value: x.modifier, text: x.amount + ' ' + x.modifier + ' (' + x.gramWeight + 'g)' });
                });
            }

            if (this.state.foodPortionDtosRecipe.length > 0) {
                this.setState({ portionsRecipe: this.state.portionsRecipe, selectedPortionRecipe: this.state.foodPortionDtosRecipe[0].modifier });
            }

            this.setState({ apiUpdatedRecipe: false, recipeUpdated: true });
        }
        

        const activeItem = this.state.activeItem;
        return (<div>
            <Grid centered>
                <Grid.Row textAlign='center'>
                    <Grid.Column width={16}>
                        <Menu color='pink' inverted attached='top' compact pointing>
                            <Menu.Item
                                name='Recipes'
                                active={activeItem === 'Recipes'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='ANZ'
                                active={activeItem === 'ANZ'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='USDA'
                                active={activeItem === 'USDA'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='prev'
                                active={activeItem === 'prev'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='manual'
                                active={activeItem === 'manual'}
                                onClick={this.handleItemClick}
                            />
                        </Menu>
                        {this.getSearchOption()}
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Segment attached='top' inverted color='grey'>
                            <Grid centered>
                                <Grid.Row stretched>
                                    <Grid.Column width={4}>
                                        <Button size='tiny' inverted fluid color={this.getColour()} onClick={this.addMeal}>Add</Button>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Button size='tiny' inverted fluid color='black' onClick={this.removeLastAddedMeal}>Undo</Button>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <span style={this.getDivLabelStyle()}>
                                            <a>{this.state.status}</a>
                                        </span>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Segment attached='bottom'>
                            <Grid centered>
                                <Grid.Row stretched>
                                    <Grid.Column as='a' width={6} textAlign='left'>
                                        <h5>Foods or Drinks</h5>
                                    </Grid.Column>
                                    <Grid.Column width={10} textAlign='left'>
                                        <input value={this.state.meal.food} onChange={this.updateFood} placeholder='Foods' />
                                    </Grid.Column>
                                    <Grid.Column as='a' width={6} textAlign='left'>
                                        <h5>Carb (g)</h5>
                                    </Grid.Column>
                                    <Grid.Column width={10} textAlign='left'>
                                        <input value={this.state.meal.carb} onChange={this.updateCarb} placeholder='Carb Macro' />
                                    </Grid.Column>
                                    <Grid.Column as='a' width={6} textAlign='left'>
                                        <h5>Protein (g)</h5>
                                    </Grid.Column>
                                    <Grid.Column width={10} textAlign='left'>
                                        <input value={this.state.meal.protein} onChange={this.updateProtein} placeholder='Protein Macro' />
                                    </Grid.Column>
                                    <Grid.Column as='a' width={6} textAlign='left'>
                                        <h5>Fat (g)</h5>
                                    </Grid.Column>
                                    <Grid.Column width={10} textAlign='left'>
                                        <input value={this.state.meal.fat} onChange={this.updateFat} placeholder='Fat Macro' />
                                    </Grid.Column>
                                    <Grid.Column as='a' width={6} textAlign='left'>
                                        <h5>Fruit/Veg (serv)</h5>
                                    </Grid.Column>
                                    <Grid.Column width={10} textAlign='left'>
                                        <input value={this.state.meal.fv} onChange={this.updateFv} placeholder='Serving' />
                                    </Grid.Column>
                                    <Grid.Column as='a' width={6} textAlign='left'>
                                        <h5>Image</h5>
                                    </Grid.Column>
                                    <Grid.Column width={10} textAlign='left'>
                                        <div>
                                            <div style={this.getDivUploadImageStyle()}>
                                                <a>{this.state.imageUploadStatus}</a>
                                            </div>
                                            <input
                                                type='file'
                                                accept="image/*"
                                                onChange={this.handleImageChange}
                                            />
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        List of added items:
                    </Grid.Column>
                    <Grid.Column width={16}>
                        {this.getRows()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>);
    }
}

export default connect()(MacroGuideModal);