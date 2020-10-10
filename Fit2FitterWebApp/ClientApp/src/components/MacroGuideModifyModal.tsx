import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Message, Header } from 'semantic-ui-react'
import ChartistGraph from 'react-chartist';
import MacroTable from './MacroTable'
import { isNullOrUndefined } from 'util';

interface IProps {
    meals: IMealDetails[];
    update: boolean;
    updateMeal: Function;
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
    meal: IMealDetails;
    prevMeal: IMealDetails;
    dirty: boolean;
    updated: boolean;
    status: string
}

class MacroGuideModifyModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            meal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false },
            prevMeal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false },
            updated: false, status:''
        };
    }

    public componentDidMount() {
        var meals = this.props.meals.filter(x => x.check === true);
        if (meals.length > 0 && !isNullOrUndefined(meals[0])) {

            var mealSource = meals[0];
            this.setState({ meal: { id: mealSource.id, food: mealSource.food, carb: mealSource.carb, protein: mealSource.protein, fat: mealSource.fat, fv: mealSource.fv, check: mealSource.check, remove: mealSource.remove } });
        }
    }

    updateFood = (event: any) => {
        this.state.meal.food = event.target.value;
        this.setState({ meal: this.state.meal });
        this.setState({ status: 'Require Update' });
    }

    updateCarb = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.carb = event.target.value;
            this.setState({ meal: this.state.meal, updated: true });
            this.setState({ status: 'Require Update' });
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
            this.setState({ status: 'Require Update' });
        }
    }

    updateFv = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.state.meal.fv = event.target.value;
            this.setState({ meal: this.state.meal, updated: true });
            this.setState({ status: 'Require Update' });
        }
    }

    update = () => {
        if (this.state.meal.food.trim().length < 1) {
            this.setState({ status: 'Error' });
            return;
        }

        this.setState({ status: 'OK' });
        this.setState({ prevMeal: this.state.meal });
        this.setState({ meal: { id: this.state.meal.id, food: this.state.meal.food, carb: this.state.meal.carb, protein: this.state.meal.protein, fat: this.state.meal.fat, fv: this.state.meal.fv, check: this.state.meal.check, remove: this.state.meal.remove } });
        this.setState({ updated: true })
    }

    undo = () => {
        this.setState({ status: 'OK' });
        this.setState({ meal: this.state.prevMeal });
        this.setState({ updated: true })
    }

    getColour = () => {
        if (this.state.status === 'OK') {
            return 'green';
        }

        return 'red';
    }

    render() {
        var divLabelStyle = {
            color: '#fffafa',
            backgroundColor: this.getColour()
        };

        var divLabelStyle1 = {
            color: '#fffafa',
            backgroundColor: 'Black'
        };

        if (this.state.dirty !== this.props.update) {
            var meals = this.props.meals.filter(x => x.check === true);
            if (meals.length > 0) {
                var mealSource = meals[0];
                this.setState({ meal: { id: mealSource.id, food: mealSource.food, carb: mealSource.carb, protein: mealSource.protein, fat: mealSource.fat, fv: mealSource.fv, check: mealSource.check, remove: mealSource.remove } });
            }
        }

        if (this.state.updated === true) {
            this.setState({ updated: false });
            var index = this.props.meals.findIndex(x => x.check === true);
            this.props.updateMeal(index, this.state.meal);
        }

        if (this.props.meals.length < 1) {
            return (<div style={divLabelStyle1}>
                <h1 color='red'>No Item to Update</h1>
            </div>);
        }

        return (<div>
            <Grid centered>
                <Grid.Row stretched>
                    <Grid.Column as='a' width={4} textAlign='left'>
                        <h5>Food</h5>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left'>
                        <input value={this.state.meal.food} onChange={this.updateFood} placeholder='Food' />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left'>
                        <h5>Carb (g)</h5>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left'>
                        <input value={this.state.meal.carb} onChange={this.updateCarb} placeholder='Carb Macro' />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left'>
                        <h5>Protein (g)</h5>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left'>
                        <input value={this.state.meal.protein} onChange={this.updateProtein} placeholder='Protein Macro' />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left'>
                        <h5>Fat (g)</h5>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left'>
                        <input value={this.state.meal.fat} onChange={this.updateFat} placeholder='Fat Macro' />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left'>
                        <h5>Fruit/Veg (serv)</h5>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left'>
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
                <Grid.Row columns={3}>
                    <Grid.Column width={8} textAlign='left' floated='left'>
                        <div>
                            <Button floated='left' size='tiny' onClick={this.update} primary>Update</Button>
                        </div>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' width={8} textAlign='left' floated='left'>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>);
    }
}

export default connect()(MacroGuideModifyModal);