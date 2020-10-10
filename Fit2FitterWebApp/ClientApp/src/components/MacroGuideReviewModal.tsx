import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Message, Header, Segment } from 'semantic-ui-react'
import ChartistGraph from 'react-chartist';
import MacroTable from './MacroTable'
import MacroGuideHeader from './MacroGuideHeader'

interface IProps {
    meals: IMeals;
    update: boolean;
    guides: IMacroGuides;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface IMeals {
    0: IMealDetails[];
    1: IMealDetails[];
    2: IMealDetails[];
    3: IMealDetails[];
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

interface IState {
    meals: IMeals;
    dirty: boolean;
}

class MacroGuideReviewModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            meals: { 0: [], 1: [], 2: [], 3: []}
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

    getMealTypeIndex = (type: number) => {
        if (type == 1) {
            return 1;
        }
        if (type == 2) {
            return 2;
        }
        if (type == 3) {
            return 3;
        }

        return 0;
    }

    getMeals = (meals: IMealDetails[]) => {
        const arr: any[] = [];
        meals.forEach((item) => { arr.push(item.food + ' : ' + item.carb + 'g ' + item.protein + 'g ' + item.fat + 'g ' + item.fv + 'serv') });
        return arr;
    }

    getTableRows = (mealType: number) => {
        var arr = this.props.meals[this.getMealTypeIndex(mealType)].filter(x => x.remove !== true);
        return (
            arr.map((item, index) =>
                <Grid.Row className={'row'} key={index} columns={5} stretched>
                    <Grid.Column className={'col_food'} key={index + 1} width={8}>
                        <a key={index + 1}>{item.food}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_carb'} key={index + 2} width={2}>
                        <a key={index + 2}>{item.carb}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_protein'} key={index + 3} width={2}>
                        <a key={index + 3}>{item.protein}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fat'} key={index + 4} width={2}>
                        <a key={index + 4}>{item.fat}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fv'} key={index + 5} width={2}>
                        <a key={index + 5}>{item.fv}</a>
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    getRows = (mealType: number) => {
        var totalCarb = (this.props.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
        var totalProtein = (this.props.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
        var totalFat = (this.props.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
        var totalFv = (this.props.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));
        return (
            <div>
                <Segment textAlign='center' attached='top'>
                    <Header as='h3'>
                        <Icon name='food' />
                        <Header.Content>{this.getMealTypeString(mealType)}</Header.Content>
                    </Header>
                </Segment>
                <Segment textAlign='center' attached='bottom'>
                    <Grid centered>
                        <Grid.Row columns={6} textAlign='center' color='grey'>
                            <Grid.Column width={2}>
                            </Grid.Column>
                            <Grid.Column width={6} textAlign='left'>
                                <div><a>Foods or Drinks</a></div>
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
                        {this.getTableRows(mealType)}
                        <Grid.Row className={'row'} key={mealType + 1} columns={5} stretched>
                            <Grid.Column className={'col_food'} key={mealType + 1} width={8}>
                                <a key={mealType + 1}>Sub-Total Macros</a>
                            </Grid.Column>
                            <Grid.Column className={'col_carb'} key={mealType + 2} width={2}>
                                <a key={mealType + 2}>{totalCarb}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_protein'} key={mealType + 3} width={2}>
                                <a key={mealType + 3}>{totalProtein}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fat'} key={mealType + 4} width={2}>
                                <a key={mealType + 4}>{totalFat}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fv'} key={mealType + 5} width={2}>
                                <a key={mealType + 5}>{totalFv}</a>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
            );
    }

    render() {
        var divLabelStyle3 = {
            color: '#fffafa',
            fontFamily: 'Comic Sans MS',
            backgroundColor: 'black'
        };

        var totalCarb: number = 0.0;
        var totalProtein: number = 0.0;
        var totalFat: number = 0.0;
        
        for (let i = 0; i < 3; i++) {
            totalCarb += (this.props.meals[this.getMealTypeIndex(i)].reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
            totalProtein += (this.props.meals[this.getMealTypeIndex(i)].reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
            totalFat += (this.props.meals[this.getMealTypeIndex(i)].reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
        }

        var data = {
            labels: ['Carb', 'Protein', 'Fat'],
            series: [
                [totalCarb, totalProtein, totalFat]
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
                <Grid.Row>
                    <Grid.Column>
                        <Segment textAlign='center' attached='bottom'>
                            <MacroGuideHeader meals={this.state.meals} guides={this.props.guides} update={this.props.update} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <div>
                            <a>Total Macros Consumptions</a>
                            <ChartistGraph data={data} type={type} />
                            <div style={divLabelStyle3}><a>Total Macros: [Carbs: {totalCarb}g] [Protein: {totalProtein}g] [Fat: {totalFat}g]</a></div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getRows(0)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getRows(1)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getRows(2)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getRows(3)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>);
    }
}

export default connect()(MacroGuideReviewModal);