import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Message, Header, List } from 'semantic-ui-react'
import ChartistGraph from 'react-chartist';
import MacroTable from './MacroTable'
import Meals from './Meals';

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

interface IState {
    meal: IMealDetails;
    meals: IMealDetails[];
    dirty: boolean;
    updated: boolean;
    status: string
}

class MacroGuideModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            meal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false },
            updated: false, meals: [], status:''
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
            this.setState({ status: 'Error' });
            return;
        }

        this.setState({ status: 'OK' });
        this.state.meals.push({ id: 0, food: this.state.meal.food, carb: this.state.meal.carb, protein: this.state.meal.protein, fat: this.state.meal.fat, fv: this.state.meal.fv, check: this.state.meal.check, remove: this.state.meal.remove });
        this.setState({ meals: this.state.meals, updated: true })
        this.setState({ meal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, check: false, remove: false } });
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
                    {item.food} - carb: {item.carb}g protein: {item.protein}g fat: {item.fat}g fruits/vegs: {item.fv} serving(s)
                </List.Item>
            ));
    }

    getColour = () => {
        if (this.state.status === 'Error') {
            return 'red';
        }

        return 'green';
    }

    render() {

        var divLabelStyle = {
            color: '#fffafa',
            backgroundColor: this.getColour()
        };

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

        
        if (this.state.dirty !== this.props.update) {
            while (this.state.meals.length > 0) {
                this.state.meals.pop();
            }
        }

        if (this.state.updated === true) {
            this.setState({ updated: false });
            this.props.addMeal(this.state.meals);
        }

        return (<div>
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
                            <Button floated='left' size='tiny' primary onClick={this.addMeal}>Add</Button>
                            <Button floated='left' size='tiny' secondary onClick={this.removeLastAddedMeal}>Undo</Button>
                        </div>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' width={8} textAlign='left' floated='left'>
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
        </div>);
    }
}

export default connect()(MacroGuideModal);