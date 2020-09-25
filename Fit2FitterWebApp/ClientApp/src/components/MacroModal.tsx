import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Message, Header } from 'semantic-ui-react'
import ChartistGraph from 'react-chartist';
import MacroTable from './MacroTable'

interface IProps {
    meals: IMeal[];
    update: boolean;
    guides: IMacroGuides;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface IMeal {
    carb: IMealDetails[];
    protein: IMealDetails[];
    fat: IMealDetails[];
    fruits: IMealDetails[];
    type: number;
}

interface IMealDetails {
    macro: number;
    mealDesc: string;
    check: boolean;
}

interface IState {
    meals: IMeal[];
    dirty: boolean;
}

class MacroModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            meals:[]
        };
    }

    public componentDidMount() {
        this.setState({ meals: this.props.meals });
    }

    getMealTypeString = (type: number) => {
        if (type === 1) {
            return 'Lunch';
        }
        if (type === 2) {
            return 'Dinner';
        }
        if (type === 3) {
            return 'Snack';
        }

        return 'Breakfast';
    }

    getCarbs = (mealType: number) => {
        const meals: any[] = [];
        this.props.meals[mealType].carb.forEach((item) => { meals.push(item.mealDesc + ' : ' + item.macro + 'g') });
        return meals;
    }

    getProtein = (mealType: number) => {
        const meals: any[] = [];
        this.props.meals[mealType].protein.forEach((item) => { meals.push(item.mealDesc + ' : ' + item.macro + 'g') });
        return meals;
    }

    getFat = (mealType: number) => {
        const meals: any[] = [];
        this.props.meals[mealType].fat.forEach((item) => { meals.push(item.mealDesc + ' : ' + item.macro + 'g') });
        return meals;
    }

    getSnack = (mealType: number) => {
        const meals: any[] = [];
        this.props.meals[mealType].fruits.forEach((item) => { meals.push(item.mealDesc + ' : ' + item.macro + 'g') });
        return meals;
    }

    getCarbHeader = (index: number) => {
        var total = (this.props.meals[index].carb.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0));
        return 'Carbs: ' + total.toFixed(2) + 'g'
    }

    getProteinHeader = (index: number) => {
        var total = (this.props.meals[index].protein.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0));
        return 'Protein: ' + total.toFixed(2) + 'g'
    }

    getFatHeader = (index: number) => {
        var total = (this.props.meals[index].fat.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0));
        return 'Fat: ' + total.toFixed(2) + 'g'
    }

    getVegHeader = (index: number) => {
        var total = (this.props.meals[index].fruits.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0));
        return 'Fruits/Veggis/Nuts: ' + total
    }

    getRows = () => {
        return (
            this.props.meals.map((item, index) =>
                <div>
                    <Header as='h3'>
                        <Icon name='food' />
                        <Header.Content>{this.getMealTypeString(index)}</Header.Content>
                    </Header>
                    <Message color='green' header={this.getCarbHeader(index)} list={this.getCarbs(index)} />
                    <Message color='yellow' header={this.getProteinHeader(index)} list={this.getProtein(index)} />
                    <Message color='red' header={this.getFatHeader(index)} list={this.getFat(index)} />
                    <Message color='grey' header={this.getVegHeader(index)} list={this.getSnack(index)} />
                    <div/>
                </div>
            ));
    }

    render() {

        var divLabelStyle1 = {
            color: '#fffafa',
            fontFamily: 'Comic Sans MS',
            backgroundColor: 'Green'
        };

        var divLabelStyle2 = {
            color: '#0a0212',
            fontFamily: 'Comic Sans MS',
            backgroundColor: 'Yellow'
        };

        var divLabelStyle3 = {
            color: '#fffafa',
            fontFamily: 'Comic Sans MS',
            backgroundColor: 'Red'
        };

        var divLabelStyle4 = {
            color: '#fffafa',
            fontFamily: 'Comic Sans MS',
            fontSize: '20px'
        };

        var divLabelStyle5 = {
            color: '#0a0212',
            fontFamily: 'Comic Sans MS',
            backgroundColor: 'White'
        };

        const consumedCarb = (this.props.meals.reduce(function (a, b) { return a + b.carb.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0); }, 0));
        const totalCarb = this.props.guides.carb - consumedCarb;

        const consumedProtein = (this.props.meals.reduce(function (a, b) { return a + b.protein.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0); }, 0));
        const totalProtein = this.props.guides.protein - consumedProtein;

        const consumedFat = (this.props.meals.reduce(function (a, b) { return a + b.fat.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0); }, 0));
        const totalFat = this.props.guides.fat - consumedFat;
        const totalVeg = this.props.guides.fruits - (this.props.meals.reduce(function (a, b) { return a + b.fruits.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0); }, 0));

        var data = {
            labels: ['Carb', 'Protein', 'Fat'],
            series: [
                [consumedCarb, consumedProtein, consumedFat]
            ]
        };

        var type = 'Line'
        var lineChartOptions = {
            low: 0,
            showArea: true
        }

        if (this.state.dirty !== this.props.update) {
            this.setState({ meals: this.props.meals, dirty: this.props.update });
        }

        return (<div>
            <Grid centered>
                <Grid.Row columns={1} color='pink' textAlign='center'>
                    <a style={divLabelStyle4}>Total Remaining Macros</a>
                </Grid.Row>
                <Grid.Row columns={4} textAlign='center'>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Carb(g)</a></div>
                        <div style={divLabelStyle1}><a>{totalCarb.toFixed(2)}</a></div>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Protein(g)</a></div>
                        <div style={divLabelStyle2}><a>{totalProtein.toFixed(2)}</a></div>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Fat(g)</a></div>
                        <div style={divLabelStyle3}><a>{totalFat.toFixed(2)}</a></div>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Serv</a></div>
                        <div style={divLabelStyle5}><a>{totalVeg}</a></div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <div>
                            <a>Total Macros Consumptions</a>
                            <ChartistGraph data={data} type={type} />
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getRows()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>);
    }
}

export default connect()(MacroModal);