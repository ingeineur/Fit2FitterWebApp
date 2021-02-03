import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Message, Header, List, Search, Dropdown, Divider, Segment, Label } from 'semantic-ui-react'
import { isNullOrUndefined } from 'util';

interface IProps {
    client: IClientDto;
    update: boolean;
    addMeal: Function;
}

interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
}

interface IMealDetails {
    id: number;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    check: boolean;
    photo: string;
    remove: boolean;
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
}

interface IMealDto {
    id: number;
    mealType: string;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    photo: string;
    updated: string;
    created: string;
    clientId: number;
}

class MacroGuideModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            meal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false, photo:'' },
            updated: false, meals: [], status: 'Ready', loading: false, searchResults: [], selectedValue: 'No Selection',
            portions: [], selectedPortion: '', apiUpdated: false, foodPortionDtos: [], usdaQuantity: 1.0,
            searchText: '', selectedFdcId: '', usdaUpdated: false, imageUploadStatus: 'No Image', searchFoodResults: [],
            searchFoodText: '', selectedFoodValue: '', dropDownString:[]
        };
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

        fetch('api/tracker/' + data['value'] + '/foods')
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
            
            fetch('api/tracker/' + fdcId + '/food/portions')
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

    render() {

        var divLabelStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getColour()
        };

        var divUploadImageStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getUploadImageColour()
        };

        var divLabelStyle2 = {
            color: 'black'
        };

        var divLabelStyle3 = {
            color: 'red'
        };
        
        if (this.state.dirty !== this.props.update) {
            while (this.state.meals.length > 0) {
                this.state.meals.pop();
            }
        }

        if (this.state.usdaUpdated === true) {
            this.setState({ usdaUpdated: false });
            this.addUsda();
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


        var linkUsda = 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/' + this.state.selectedFdcId + '/nutrients';

        return (<div>
            <Segment attached='top'>
                <Label color='blue' ribbon>Search Option 1</Label>
                <span>USDA Food Database</span>
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
                            <div style={divLabelStyle3}>
                                <a style={divLabelStyle3} href={linkUsda} target='_blank'>{this.state.selectedValue}</a>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={3} stretched textAlign='left'>
                        <Grid.Column width={4} textAlign='left'>
                            <a style={divLabelStyle2}>Quantity:</a>
                        </Grid.Column>
                        <Grid.Column width={2} textAlign='left'>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left' floated='left'>
                            <a style={divLabelStyle2}>Meal Portions:</a>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <Input size='small' value={this.state.usdaQuantity} onChange={this.updateUsdaQuantity} placeholder='Quantity' />
                        </Grid.Column>
                        <Grid.Column width={2} textAlign='center'>
                            <div style={divLabelStyle2}>
                                <h3>x</h3>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left'>
                            <Dropdown fluid id='portions' value={this.state.selectedPortion} selection options={this.state.portions} onChange={this.handleSelectPortion} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment attached='top'>
                <Label color='red' ribbon>Search Option 2</Label>
                <span>Previous Meals Entries</span>
                <Grid centered>
                    <Grid.Row stretched textAlign='left'>
                        <Grid.Column textAlign='center' width={16}>
                            <div style={divLabelStyle3}>
                                <a style={divLabelStyle3}>Copy your own meals entered since last 5 days</a>
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
            </Segment>
            <div style={divLabelStyle}>
                <a>{this.state.status}</a>
            </div>
            <Segment attached='top'>
                <Label color='orange' ribbon>Meal Entry</Label>
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
                                <div style={divUploadImageStyle}>
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
                    <Grid.Row columns={2}>
                        <Grid.Column width={10} textAlign='left' floated='left'>
                            <div>
                                <Button floated='left' size='tiny' primary onClick={this.addMeal}>Add</Button>
                                <Button floated='left' size='tiny' secondary onClick={this.removeLastAddedMeal}>Undo</Button>
                            </div>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' width={6} textAlign='left' floated='left'>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div>
                    <a>List of new items:</a>
                    <List>
                        {this.getItems()}
                    </List>
                </div>
            </Segment>
        </div>);
    }
}

export default connect()(MacroGuideModal);