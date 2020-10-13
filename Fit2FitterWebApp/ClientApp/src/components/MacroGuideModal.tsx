import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Message, Header, List, Search, Dropdown, Segment } from 'semantic-ui-react'
import ChartistGraph from 'react-chartist';
import MacroTable from './MacroTable'
import Meals from './Meals';
import { isNullOrUndefined } from 'util';

interface IProps {
    update: boolean;
    addMeal: Function;
}

interface IMealDetails {
    id: number;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    check: boolean;
    remove: boolean;
}

interface IFoodLegacyDto {
    fdcId: string,
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
    selectedFdcId: string
}

class MacroGuideModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            meal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false },
            updated: false, meals: [], status: '', loading: false, searchResults: [], selectedValue: 'No Selection',
            portions: [], selectedPortion: '', apiUpdated: false, foodPortionDtos: [], usdaQuantity: 1.0,
            searchText: '', selectedFdcId: ''
        };
    }

    public componentDidMount() {
    }

    updateFood = (event: any) => {
        this.state.meal.food = event.target.value;
        this.setState({ meal: this.state.meal });
    }

    updateCarb = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.carb = event.target.value;
            this.setState({ meal: this.state.meal, updated: true });
        }
    }

    updateProtein = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.protein = event.target.value;
            this.setState({ meal: this.state.meal, updated: true });
        }
    }

    updateFat = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.fat = event.target.value;
            this.setState({ meal: this.state.meal, updated: true });
        }
    }

    updateFv = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.fv = event.target.value;
            this.setState({ meal: this.state.meal, updated: true });
        }
    }

    addMeal = () => {
        if (this.state.meal.food.trim().length < 1) {
            this.setState({ status: 'Error: No Food Description' });
            return;
        }

        this.setState({ status: 'Added to list' });
        this.state.meals.push({ id: 0, food: this.state.meal.food, carb: this.state.meal.carb, protein: this.state.meal.protein, fat: this.state.meal.fat, fv: this.state.meal.fv, check: this.state.meal.check, remove: this.state.meal.remove });
        this.setState({ meals: this.state.meals, updated: true })
        this.setState({ meal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false } });
    }

    updateUsdaQuantity = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ usdaQuantity: event.target.value });
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

        return (
            this.state.meals.map((item, index) =>
                <List.Item key={index}>
                    {item.food} - carb: {item.carb.toFixed(2)}g protein: {item.protein.toFixed(2)}g fat: {item.fat.toFixed(2)}g fruits/vegs: {item.fv} serving(s)
                </List.Item>
            ));
    }

    getColour = () => {
        if (this.state.status.includes('Error')) {
            return 'red';
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
        console.log(data);
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

    handleSelectPortion = (event: any, data: any) => {
        this.setState({ updated: true, selectedPortion: data['value'] });
    }

    addUsda = () => {
        this.state.meal.food = this.state.selectedValue;
        if (this.state.portions.length > 0 && this.state.foodPortionDtos.length > 0) {
            this.state.foodPortionDtos.forEach(x => {
                if (x.modifier === this.state.selectedPortion) {
                    this.state.meal.carb = this.state.usdaQuantity * x.carbValue * x.gramWeight;
                    this.state.meal.protein = this.state.usdaQuantity * x.proteinValue * x.gramWeight;
                    this.state.meal.fat = this.state.usdaQuantity * x.fatValue * x.gramWeight;
                }
            });
        }
        else {
            this.state.meal.carb = 0.0;
            this.state.meal.protein = 0.0;
            this.state.meal.fat = 0.0;
            this.state.meal.fv = this.state.usdaQuantity;
        }

        this.setState({ meal: this.state.meal });
    }

    render() {

        var divLabelStyle = {
            color: '#fffafa',
            backgroundColor: this.getColour()
        };
        
        if (this.state.dirty !== this.props.update) {
            while (this.state.meals.length > 0) {
                this.state.meals.pop();
            }
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
        }

        
        var linkUsda = 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/' + this.state.selectedFdcId + '/nutrients';

        return (<div>
            <Message color='blue'>
                <Grid centered>
                    <Grid.Row stretched textAlign='left'>
                        <Grid.Column as='a' width={16} textAlign='left'>
                            <h4 color='grey'>Food Database Search (USDA Food Data)</h4>
                        </Grid.Column>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Search Keywords:</h5>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left' floated='left'>
                            <Search
                                fluid
                                loading={this.state.loading}
                                onSearchChange={this.handleSearchChange}
                                onResultSelect={this.handleSelectResult}
                                results={this.state.searchResults}
                                value={this.state.searchText}
                            />
                        </Grid.Column>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Selected Item:</h5>
                        </Grid.Column>
                        <Grid.Column as='a' width={10} textAlign='left'>
                            <a>{this.state.selectedValue}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Quantity:</h5>
                        </Grid.Column>
                        <Grid.Column width={5} textAlign='left'>
                            <input value={this.state.usdaQuantity} onChange={this.updateUsdaQuantity} placeholder='Quantity' />
                        </Grid.Column>
                        <Grid.Column width={5} textAlign='left'>
                            <a> x  Portion</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Portion:</h5>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left' floated='left'>
                            <Dropdown basic id='portions' value={this.state.selectedPortion} selection options={this.state.portions} onChange={this.handleSelectPortion} />
                        </Grid.Column>
                        <Grid.Column as='a' width={6} textAlign='left'>
                        </Grid.Column>
                        <Grid.Column as='a' width={10} textAlign='left'>
                            <div/>
                            <Button floated='left' size='tiny' primary onClick={this.addUsda}>Use</Button>
                            <a href={linkUsda} target='_blank'>Data Source: USDA Data Food Central</a>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Message>
            <Message color='grey'>
                <Grid centered>
                    <Grid.Row stretched>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Foods or Drinks</h5>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left'>
                            <input value={this.state.meal.food} onChange={this.updateFood} placeholder='Food' />
                        </Grid.Column>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Carb (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left'>
                            <input value={this.state.meal.carb.toFixed(2)} onChange={this.updateCarb} placeholder='Carb Macro' />
                        </Grid.Column>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Protein (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left'>
                            <input value={this.state.meal.protein.toFixed(2)} onChange={this.updateProtein} placeholder='Protein Macro' />
                        </Grid.Column>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Fat (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left'>
                            <input value={this.state.meal.fat.toFixed(2)} onChange={this.updateFat} placeholder='Fat Macro' />
                        </Grid.Column>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Fruit/Veg (serv)</h5>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left'>
                            <input value={this.state.meal.fv} onChange={this.updateFv} placeholder='Serving' />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' width={16} textAlign='center' floated='left'>
                            <div style={divLabelStyle}>
                                <a>{this.state.status}</a>
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
                    <Grid.Row>
                        <Grid.Column>
                            <a>List of new items:</a>
                            <List>
                                {this.getItems()}
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Message>
        </div>);
    }
}

export default connect()(MacroGuideModal);