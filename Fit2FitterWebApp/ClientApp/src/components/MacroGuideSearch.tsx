import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Icon, Input, Grid, Message, Header, List, Search, Dropdown, Divider, Dimmer, Loader, Menu } from 'semantic-ui-react'
import ChartistGraph from 'react-chartist';
import { isNullOrUndefined } from 'util';
import { IClientDto } from '../models/clients';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import AppsMenu from './AppMenus';

interface IProps {
}

var divLabelStyle1 = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'blue'
};

var divLabelStyle2 = {
    color: 'black'
};

var divLabelStyle3 = {
    color: 'red'
};

var options2 = {
    reverseData: true,
    showLabel: true
};

var responsiveOptions = [
    ['screen and (min-width: 640px)', {
        chartPadding: 30,
        labelOffset: 100,
        labelDirection: 'explode',
        labelInterpolationFnc: function (value: number) {
            return value;
        }
    }],
    ['screen and (min-width: 1024px)', {
        labelOffset: 80,
        chartPadding: 20
    }]
];

var options = {
    seriesBarDistance: 10,
    reverseData: true,
    distributeSeries: true,
    horizontalBars: true,
    axisY: {
        offset: 70
    }
}

interface IMealDetails {
    id: number;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    sugar: number,
    fiber: number,
    water: number,
    vitaminA: number,
    vitaminB6: number,
    vitaminC: number,
    vitaminD: number,
    calcium: number,
    iron: number,
    potassium: number,
    zinc: number,
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
    sugarValue: number,
    fiberValue: number,
    waterValue: number,
    vitaminAValue: number,
    vitaminB6Value: number,
    vitaminCValue: number,
    vitaminDValue: number,
    calciumValue: number,
    ironValue: number,
    potassiumValue: number,
    zincValue: number,
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
    clientDtos: IClientDto[];
    clientDtosUpdated: boolean;
    activeItem: string;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators; // ... plus action creators we've requested

class MacroGuideSearch extends React.Component<LoginProps, IState> {

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            dirty: false,
            meal: {
                id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false, sugar: 0, water: 0, fiber: 0,
                vitaminA: 0, vitaminB6: 0, vitaminC: 0, vitaminD: 0, calcium: 0, potassium: 0, iron: 0, zinc: 0 },
            updated: false, meals: [], status: 'Ready', loading: false, searchResults: [], selectedValue: 'No Selection',
            portions: [], selectedPortion: '', apiUpdated: false, foodPortionDtos: [], usdaQuantity: 1.0,
            searchText: '', selectedFdcId: '', usdaUpdated: false, clientDtos: [], clientDtosUpdated: false,
            activeItem: 'USDA'
        };
    }

    public componentDidMount() {
        this.props.getLogin();
        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, clientDtosUpdated: true
                })).catch(error => console.log(error));
        }
    }

    updateCarb = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.carb = event.target.value;
            this.setState({ meal: this.state.meal, updated: true, status: 'Pending to add' });
        }
    }

    updateProtein = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.protein = event.target.value;
            this.setState({ meal: this.state.meal, updated: true, status: 'Pending to add' });
        }
    }

    updateFat = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.fat = event.target.value;
            this.setState({ meal: this.state.meal, updated: true, status: 'Pending to add' });
        }
    }

    updateFv = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.fv = event.target.value;
            this.setState({ meal: this.state.meal, updated: true, status: 'Pending to add' });
        }
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
        this.setState({ status: 'Updating Data.......' });
        var sel = data['result'];
        if (!isNullOrUndefined(sel)) {
            this.setState({ selectedValue: sel['description'] });
            var fdcId = sel['fdcId'];
            
            fetch('api/food/' + fdcId + '/food/portions')
                .then(response => response.json() as Promise<IFoodPortionDto[]>)
                .then(data => this.setState({
                    foodPortionDtos: data, apiUpdated: true, portions: [], usdaQuantity: 1.0, selectedFdcId: fdcId, status: 'data updated'
                })).catch(error => console.log(error))
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
                    this.state.meal.carb = parseFloat((this.state.usdaQuantity * x.carbValue * x.gramWeight).toFixed(3));
                    this.state.meal.protein = parseFloat((this.state.usdaQuantity * x.proteinValue * x.gramWeight).toFixed(3));
                    this.state.meal.fat = parseFloat((this.state.usdaQuantity * x.fatValue * x.gramWeight).toFixed(3));

                    this.state.meal.water = parseFloat((this.state.usdaQuantity * x.waterValue * x.gramWeight).toFixed(3));
                    this.state.meal.fiber = parseFloat((this.state.usdaQuantity * x.fiberValue * x.gramWeight).toFixed(3));
                    this.state.meal.sugar = parseFloat((this.state.usdaQuantity * x.sugarValue * x.gramWeight).toFixed(3));

                    this.state.meal.vitaminA = parseFloat((this.state.usdaQuantity * x.vitaminAValue * x.gramWeight).toFixed(3));
                    this.state.meal.vitaminB6 = parseFloat((this.state.usdaQuantity * x.vitaminB6Value * x.gramWeight).toFixed(3));
                    this.state.meal.vitaminC = parseFloat((this.state.usdaQuantity * x.vitaminCValue * x.gramWeight).toFixed(3));
                    this.state.meal.vitaminD = parseFloat((this.state.usdaQuantity * x.vitaminDValue * x.gramWeight).toFixed(3));

                    this.state.meal.calcium = parseFloat((this.state.usdaQuantity * x.calciumValue * x.gramWeight).toFixed(3));
                    this.state.meal.potassium = parseFloat((this.state.usdaQuantity * x.potassiumValue * x.gramWeight).toFixed(3));
                    this.state.meal.iron = parseFloat((this.state.usdaQuantity * x.ironValue * x.gramWeight).toFixed(3));
                    this.state.meal.zinc = parseFloat((this.state.usdaQuantity * x.zincValue * x.gramWeight).toFixed(3));
                }
            });
        }
        else {
            this.state.meal.carb = 0.0;
            this.state.meal.protein = 0.0;
            this.state.meal.fat = 0.0;
            this.state.meal.fv = this.state.usdaQuantity;
        }

        this.setState({ meal: this.state.meal, status: 'Data Updated', updated: true });
    }

    getColour = () => {
        if (this.state.status.includes('Updating')) {
            return 'orange';
        }

        return 'green';
    }

    isLoadingData = () => {
        if (!this.state.clientDtosUpdated) {
            return true;
        }
        return false;
    }

    getDivLabelStyle = () => {
        return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getColour()
        };
    }

    getUSDA = () => {
        var totalGram: number = 1;
        var selectedPortion = this.state.foodPortionDtos.find(x => x.modifier === this.state.selectedPortion);
        if (!isNullOrUndefined(selectedPortion)) {
            totalGram = selectedPortion.gramWeight;
        }

        var data = {
            labels: ['Carb', 'Protein', 'Fat', 'Fiber', 'Sugar'],
            series: [
                ((this.state.meal.carb) / totalGram) * 100.0
                ,
                ((this.state.meal.protein) / totalGram) * 100.0
                ,
                ((this.state.meal.fat) / totalGram) * 100.0
                ,
                ((this.state.meal.fiber) / totalGram) * 100.0
                ,
                ((this.state.meal.sugar) / totalGram) * 100.0
            ]
        };

        var percentageWater = (this.state.meal.water / totalGram) * 100.0;
        var data2 = {
            labels: ['Water', 'Solid'],
            series: [percentageWater, 100.0 - percentageWater]
        }

        var linkUsda = 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/' + this.state.selectedFdcId + '/nutrients';
        return (<div>
            <Message color='blue' attached='top'>
                <Grid centered>
                    <Grid.Row stretched textAlign='left'>
                        <Grid.Column textAlign='center' width={16}>
                            <h3>Food Search</h3>
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
                        <Grid.Column verticalAlign='middle' as='a' width={16} textAlign='center'>
                            <Grid centered>
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
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Message>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='food' />
                    Nutrition Facts
                </Header>
            </Divider>
            <Message attached='bottom'>
                <div style={this.getDivLabelStyle()}>
                    <a>{this.state.status}</a>
                </div>
                <Grid centered>
                    <Grid.Row stretched>
                        <Grid.Column as='a' width={6} textAlign='left'>
                            <h5>Food Name</h5>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign='left'>
                            <a>{this.state.meal.food}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Total Weight (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{totalGram * this.state.usdaQuantity}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Carb (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.carb}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Protein (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.protein}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Fat (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.fat}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Fiber (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.fiber}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Water (Moistures) (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.water}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Sugar: Fructose, Luctose, Glucose (g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.sugar}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Vitamin A (micro-g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.vitaminA}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Vitamin B6 (micro-g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.vitaminB6}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Vitamin C (micro-g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.vitaminC}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Vitamin D (micro-g)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.vitaminD}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Calcium (mg)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.calcium}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Iron (mg)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.iron}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Potassium (mg)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.potassium}</a>
                        </Grid.Column>
                        <Grid.Column as='a' width={12} textAlign='left'>
                            <h5>Zinc (mg)</h5>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <a>{this.state.meal.zinc}</a>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div>
                    <a style={divLabelStyle1}>Percentage (%) of macro-nutrients</a>
                    <ChartistGraph data={data} type='Bar' options={options} />
                </div>
                <div>
                    <a style={divLabelStyle1}>Percentage (%) of water (moistures)</a>
                    <ChartistGraph data={data2} type='Pie' options={options2} />
                </div>
                <a>Data Source: </a><a style={divLabelStyle3} href={linkUsda} target='_blank'>USDA Food Data Central</a>
            </Message>
        </div>);
    }

    getSearchOption = () => {
        if (this.state.activeItem == 'USDA') {
            return this.getUSDA();
        }

        return this.getUSDA();
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    render() {
        if (this.props.logins.length > 0) {
            var divLoaderStyle = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            };

            if (this.state.usdaUpdated === true) {
                this.setState({ usdaUpdated: false });
                this.addUsda();
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

            if (this.isLoadingData()) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                </div>);
            }

            return (<div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <AppsMenu activeItem='Nutrients Lookup' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                            <Divider />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Menu attached='top' tabular compact>
                                <Menu.Item
                                    name='USDA'
                                    active={this.state.activeItem === 'USDA'}
                                    onClick={this.handleItemClick}
                                />
                            </Menu>
                            {this.getSearchOption()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>);
        }
        return (<Redirect to="/" />);
    }
}

export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(MacroGuideSearch as any);