import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Message, Header, Segment } from 'semantic-ui-react';
import ChartistGraph from 'react-chartist';
import MacroGuideHeader from './MacroGuideHeader';
import MessagesMealsChat from './MessagesMealsChat';

interface IProps {
    update: boolean;
    clientId: number;
    senderId: number;
    mealDate: string;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface IMealDto {
    id: number;
    mealType: string;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    updated: string;
    created: string;
    clientId: number;
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

interface IMacrosPlanDto {
    id: number,
    height: number,
    weight: number,
    macroType: string;
    activityLevel: string;
    carbPercent: number,
    proteinPercent: number,
    fatPercent: number,
    updated: string;
    created: string;
    clientId: number;
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

interface IState {
    meals: IMeals;
    dirty: boolean;
    clientId: number;
    mealDate: string;
    mealDtos: IMealDto[];
    apiUpdate: boolean;
    updated: boolean;
    macrosPlanDtos: IMacrosPlanDto[];
    clientDtos: IClientDto[];
    guides: IMacroGuides;
}

class MacroGuideReviewModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            meals: { 0: [], 1: [], 2: [], 3: [] },
            clientId: 0,
            mealDate: '',
            mealDtos: [],
            apiUpdate: false,
            updated: false,
            macrosPlanDtos: [],
            clientDtos: [],
            guides: { carb: 0, protein: 0, fat: 0, fruits: 0 }
        };
    }

    public componentDidMount() {
        this.setState({ clientId: this.props.clientId, mealDate: this.props.mealDate });

        console.log(this.props.mealDate);

        //get client info
        fetch('api/client?clientId=' + this.props.clientId)
            .then(response => response.json() as Promise<IClientDto[]>)
            .then(data => this.setState({
                clientDtos: data, apiUpdate: true
            })).catch(error => console.log(error));

        //get macros plan
        fetch('api/client/' + this.props.clientId + '/macrosplan')
            .then(response => response.json() as Promise<IMacrosPlanDto[]>)
            .then(data => this.setState({
                macrosPlanDtos: data, apiUpdate: true
            })).catch(error => console.log(error));

        //get all meals
        fetch('api/tracker/' + this.props.clientId + '/macrosguide?date=' + this.props.mealDate)
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => this.setState({
                mealDtos: data, apiUpdate: true, updated: !this.state.updated
            })).catch(error => console.log(error));
    }

    getActivityLevel = (activityLevel: string) => {
        if (activityLevel == 'Sedentary') {
            return 1.2;
        }

        if (activityLevel == 'Lightly Active') {
            return 1.375;
        }

        if (activityLevel == 'Moderately Active') {
            return 1.55;
        }

        if (activityLevel == 'Very Active') {
            return 1.725;
        }

        if (activityLevel == 'Extra Active') {
            return 1.9;
        }

        return 0;
    }

    setMacroGuides = () => {
        if (this.state.macrosPlanDtos.length > 0 && this.state.clientDtos.length > 0) {
            const client = this.state.clientDtos[0];
            const macrosPlan = this.state.macrosPlanDtos[0];
            const bmr = (10 * macrosPlan.weight) + (6.25 * macrosPlan.height) - (5 * client.age) - 161;
            const totalCalories = this.getActivityLevel(macrosPlan.activityLevel) * bmr;
            const carb = ((macrosPlan.carbPercent / 100.0 * totalCalories) / 4).toFixed(2);
            const protein = ((macrosPlan.proteinPercent / 100.0 * totalCalories) / 4).toFixed(2);
            const fat = ((macrosPlan.fatPercent / 100.0 * totalCalories) / 9).toFixed(2);

            this.state.guides.carb = parseFloat(carb);
            this.state.guides.protein = parseFloat(protein);
            this.state.guides.fat = parseFloat(fat);
            this.state.guides.fruits = 4;
            this.setState({ guides: this.state.guides });
        }
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

    getTableRows = (mealType: number) => {
        var arr = this.state.meals[this.getMealTypeIndex(mealType)].filter(x => x.remove !== true);
        return (
            arr.map((item, index) =>
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

    getRows = (mealType: number) => {
        var totalCarb = (this.state.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
        var totalProtein = (this.state.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
        var totalFat = (this.state.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
        var totalFv = (this.state.meals[this.getMealTypeIndex(mealType)].reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));
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
                        <Grid.Row columns={6} textAlign='left' color='grey'>
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
                        <Grid.Row color='yellow' className={'row'} key={mealType + 1} columns={5} stretched>
                            <Grid.Column className={'col_food'} key={mealType + 1} width={8}>
                                <a key={mealType + 1}>Sub-Total Macros</a>
                            </Grid.Column>
                            <Grid.Column className={'col_carb'} key={mealType + 2} width={2}>
                                <a key={mealType + 2}>{totalCarb.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_protein'} key={mealType + 3} width={2}>
                                <a key={mealType + 3}>{totalProtein.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fat'} key={mealType + 4} width={2}>
                                <a key={mealType + 4}>{totalFat.toFixed(2)}</a>
                            </Grid.Column>
                            <Grid.Column className={'col_fv'} key={mealType + 5} width={2}>
                                <a key={mealType + 5}>{totalFv.toFixed(2)}</a>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
            );
    }

    getMealType = (type: string) => {
        if (type == 'Lunch') {
            return 1;
        }
        if (type == 'Dinner') {
            return 2;
        }
        if (type == 'Snack') {
            return 3;
        }

        return 0;
    }

    setMeals = () => {
        if (this.state.mealDtos.length > 0) {

            var totalMeals = 0;
            for (let i = 0; i < 4; i++) {
                totalMeals += this.state.meals[this.getMealTypeIndex(i)].length;
            }

            if (totalMeals === this.state.mealDtos.length) {
                return;
            }

            this.state.mealDtos.forEach(meal => {
                this.state.meals[this.getMealType(meal.mealType)].push({ id: meal.id, food: meal.food, carb: meal.carb, protein: meal.protein, fat: meal.fat, fv: meal.fv, check: false, remove: false });
            })

            this.setState({ meals: this.state.meals });
        }
    }

    getMeals = () => {
        if (this.state.clientId === 0 || this.state.mealDate.trim().length < 1) {
            return;
        }

        fetch('api/tracker/' + this.state.clientId + '/macrosguide?date=' + this.state.mealDate)
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => this.setState({
                mealDtos: data, apiUpdate: true
            })).catch(error => console.log(error));
    }

    resetMeals = () => {
        this.setState({
            meals: { 0: [], 1: [], 2: [], 3: [] }
        });
    }

    render() {
        var divLabelStyle3 = {
            color: '#fffafa',
            fontFamily: 'Comic Sans MS',
            backgroundColor: 'black'
        };

        if (this.state.dirty !== this.props.update) {
            this.setState({ mealDate: this.props.mealDate, dirty: this.props.update });
            this.resetMeals();
            this.getMeals();
        }

        if (this.state.apiUpdate === true) {
            this.setState({ apiUpdate: false });
            this.setMacroGuides();
            this.setMeals();
            this.setState({ updated: !this.state.updated });
        }

        var totalCarb: number = 0.0;
        var totalProtein: number = 0.0;
        var totalFat: number = 0.0;
        
        for (let i = 0; i < 4; i++) {
            totalCarb += (this.state.meals[this.getMealTypeIndex(i)].reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
            totalProtein += (this.state.meals[this.getMealTypeIndex(i)].reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
            totalFat += (this.state.meals[this.getMealTypeIndex(i)].reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
        }

        var data = {
            labels: ['Carb', 'Protein', 'Fat'],
            series: [
                [totalCarb, totalProtein, totalFat]
            ]
        };

        var type = 'Line'
        var lineChartOptions = {
            reverseData: false,
            showArea: true
        }

        var divCarb = {
            color: 'red',
            backgroundColor: 'red'
        };

        var divPro = {
            color: '#FF5E13',
            backgroundColor: '#FF5E13'
        };

        var divFat = {
            color: 'yellow',
            backgroundColor: 'yellow'
        };

        var divVeg = {
            color: '#CE8B54',
            backgroundColor: '#CE8B54'
        };

        var carbMacros: number[] = [];
        var proMacros: number[] = [];
        var fatMacros: number[] = [];
        var vegMacros: number[] = [];

        var totalC: number = 0.0;
        var totalP: number = 0.0;
        var totalF: number = 0.0;
        var totalV: number = 0.0;

        for (let i = 0; i < 4; i++) {
            var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
            totalC += (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
            totalP += (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
            totalF += (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
            totalV += (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));
        }

        for (var i = 0; i < 4; i++) {
            if (i === 0) {
                var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
                var totalCarb = (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
                var totalProtein = (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
                var totalFat = (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
                var totalVeg = (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));

                carbMacros.push((totalCarb / totalC) * 100.0);
                proMacros.push((totalProtein / totalP) * 100.0);
                fatMacros.push((totalFat / totalF) * 100.0);
                vegMacros.push((totalVeg / totalV) * 100.0);
            }
            else if (i === 1) {
                var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
                var totalCarb = (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
                var totalProtein = (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
                var totalFat = (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
                var totalVeg = (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));

                carbMacros.push((totalCarb / totalC) * 100.0);
                proMacros.push((totalProtein / totalP) * 100.0);
                fatMacros.push((totalFat / totalF) * 100.0);
                vegMacros.push((totalVeg / totalV) * 100.0);
            }
            else if (i === 2) {
                var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
                var totalCarb = (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
                var totalProtein = (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
                var totalFat = (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
                var totalVeg = (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));

                carbMacros.push((totalCarb / totalC) * 100.0);
                proMacros.push((totalProtein / totalP) * 100.0);
                fatMacros.push((totalFat / totalF) * 100.0);
                vegMacros.push((totalVeg / totalV) * 100.0);
            }
            else {
                var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
                var totalCarb = (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
                var totalProtein = (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
                var totalFat = (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
                var totalVeg = (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));

                carbMacros.push((totalCarb / totalC) * 100.0);
                proMacros.push((totalProtein / totalP) * 100.0);
                fatMacros.push((totalFat / totalF) * 100.0);
                vegMacros.push((totalVeg / totalV) * 100.0);
            }
        }

        var data2 = {
            labels: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
            series: [
                carbMacros, proMacros, fatMacros, vegMacros
            ]
        };

        var options = {
            reverseData: false,
            seriesBarDistance: 10
        };

        return (<div>
            <Grid centered>
                <Grid.Row>
                    <Grid.Column>
                        <Segment textAlign='center' attached='bottom'>
                            <MacroGuideHeader meals={this.state.meals} guides={this.state.guides} update={this.state.updated} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <div>
                            <a>Total Macros Consumptions</a>
                            <ChartistGraph data={data} options={lineChartOptions} type={type} />
                            <div style={divLabelStyle3}><a>Total Macros: [Carbs: {totalC.toFixed(2)}g] [Protein: {totalP.toFixed(2)}g] [Fat: {totalF.toFixed(2)}g]</a></div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <div>
                            <a>Breakdown (%) of Macros Consumptions</a>
                        </div>
                        <div>
                            <ChartistGraph data={data2} options={options} type='Bar' />
                            <a style={divCarb}>col</a><a>Carb% </a><a style={divPro}>col</a><a>Protein%</a><a style={divFat}>col</a><a> Fat% </a><a style={divVeg}>col</a><a> Fruits/Veg%</a>
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
                <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <Header as='h3'>
                                <Icon name='comment' />
                                <Header.Content>Comments</Header.Content>
                            </Header>
                            <MessagesMealsChat clientId={this.props.senderId} toClientId={this.props.clientId} created={this.props.mealDate} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>);
    }
}

export default connect()(MacroGuideReviewModal);