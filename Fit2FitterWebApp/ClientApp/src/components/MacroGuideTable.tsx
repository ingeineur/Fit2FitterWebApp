import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Label, Icon, Segment, Checkbox, Modal } from 'semantic-ui-react'
import MacroGuideModal from './MacroGuideModal'
import MacroGuideModifyModal from './MacroGuideModifyModal'

interface IProps {
    meals: IMealDetails[] 
    update: boolean;
    mealType: number;
    updateMeals: Function
}

interface IMealDetails {
    id: number;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    check: boolean;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
    mealType: number;
    meals: IMealDetails[];
    addedMeals: IMealDetails[];
    openAddMeal: boolean;
    updateMeal: boolean;
    dirty: boolean;
}

class MacroGuideTable extends React.Component<IProps, IState> {

    addMeal = (meals: IMealDetails[]) => {
        while (this.state.addedMeals.length > 0) {
            this.state.addedMeals.pop();
        }
        meals.forEach(x => this.state.addedMeals.push(x));
        this.setState({ addedMeals: this.state.addedMeals });
    }

    constructor(props: IProps) {
        super(props);
        this.addMeal = this.addMeal.bind(this);
        this.state = {
            username: '', password: '', updated: false, mealType: 1, meals: [],
            dirty: false, openAddMeal: false, updateMeal: false, addedMeals:[]
        };
    }

    public componentDidMount() {
        this.setState({
            meals: this.props.meals
        });
    }

    handleMealDescChange = (field: any, value: any) => {
        this.state.meals[parseInt(value['className'])]['food'] = value['value'];
        this.setState({ meals: this.state.meals, updated: true });
    }

    handleMacroChange = (field: any, value: any) => {
        //if (parseFloat(value['value']) === 0 || isNaN(parseFloat(value['value']))) {
        //    this.state.meals[parseInt(value['className'])]['macro'] = 0.0;
        //}
        //else {
        //    const re = /^[-+,0-9,\.]+$/;
        //    if (value['value'] === '' || re.test(value['value'])) {
        //        this.state.meals[parseInt(value['className'])]['macro'] = value['value'];
        //    }
        //}

        const re = /^[-+,0-9,\.]+$/;
        if (value['value'] === '' || re.test(value['value'])) {
            this.state.meals[parseInt(value['className'])]['carb'] = value['value'];
            this.setState({ meals: this.state.meals, updated: true });
        }
    }

    handleCheckChange = (field: any, value: any) => {
        console.log(value['checked']);
        this.state.meals[parseInt(value['className'])]['check'] = value['value'];
        this.setState({ meals: this.state.meals, updated: true });
    }

    getRows = () => {
        return (
            this.state.meals.map((item, index) =>
                <Grid.Row className={'row'} key={index} columns={3} stretched>
                    <Grid.Column className={'col_checkbox'} key={index} width={2} verticalAlign='middle' textAlign='center'>
                        <Checkbox className={index.toString()} checked={item.check} key={index} onChange={this.handleCheckChange} />
                    </Grid.Column>
                    <Grid.Column className={'col_food'} key={index + 1} width={6}>
                        <a>{item.food}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_carb'} key={index + 2} width={2}>
                        <a>{item.carb}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_protein'} key={index + 3} width={2}>
                        <a>{item.protein}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fat'} key={index + 4} width={2}>
                        <a>{item.fat}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fv'} key={index + 5} width={2}>
                        <a>{item.fv}</a>
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    addActivity = (event: any) => {
        this.state.meals.push({ id: 0, food: 'empty', carb: 0, protein: 0, fat:0, fv:0, check: false });
        this.setState({ updated: true });
    }

    removeActivities = (event: any) => {
        var arr = this.state.meals.filter(obj => obj.check === false);
        this.setState({ updated: true, meals: arr });
    }

    handleOpen = (open: boolean) => {
        this.setState({ openAddMeal: open });
    }

    handleAdd = (open: boolean) => {
        if (this.state.addedMeals.length > 0) {
            this.state.meals.push(...this.state.addedMeals);
        }

        while (this.state.addedMeals.length > 0) {
            this.state.addedMeals.pop();
        }
        this.setState({ openAddMeal: open, addedMeals: this.state.addedMeals, meals: this.state.meals });
    }

    handleCancelAdd = (open: boolean) => {
        while (this.state.addedMeals.length > 0) {
            this.state.addedMeals.pop();
        }

        this.setState({ openAddMeal: open, addedMeals: this.state.addedMeals });
    }

    handleUpdateOpen = (open: boolean) => {
        this.setState({ updateMeal: open });
    }

    render() {

        if (this.state.mealType !== this.props.mealType)
        {
            this.setState({ meals: this.props.meals, mealType: this.props.mealType });
        }
        else if (this.props.update !== this.state.dirty) {
            this.setState({ meals: this.props.meals, mealType: this.props.mealType, dirty: this.props.update });
            console.log(this.props.meals);
            console.log(this.props.mealType);
        }

        if (this.state.updated === true) {
            this.setState({ updated: false });
            this.props.updateMeals(this.props.mealType, this.state.meals);
        }

        var divLabelStyle5 = {
            color: '#0a0212',
            backgroundColor: 'White'
        };

        return (
            <Grid centered>
                <Grid.Column>
                    <Segment attached='top'>
                        <Grid centered>
                            <Grid.Row columns={3}>
                                <Grid.Column floated='left' width={4}>
                                    <Button size='tiny' color='red' fluid icon onClick={this.removeActivities}>
                                        <Icon name='minus' />
                                    </Button>
                                </Grid.Column>
                                <Grid.Column floated='right' width={4}>
                                    <Modal
                                        open={this.state.openAddMeal}
                                        onClose={() => this.handleOpen(false)}
                                        onOpen={() => this.handleOpen(true)}
                                        trigger={<Button size='tiny' color='blue' fluid icon>
                                            <Icon name='plus' />
                                        </Button>}>
                                        <Modal.Header>Add Your Meal</Modal.Header>
                                        <Modal.Content scrolling>
                                            <Modal.Description>
                                                <MacroGuideModal addMeal={this.addMeal} update={this.state.updated} />
                                            </Modal.Description>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button size='tiny' onClick={() => this.handleCancelAdd(false)} secondary>
                                                Cancel <Icon name='chevron right' />
                                            </Button>
                                            <Button size='tiny' onClick={() => this.handleAdd(false)} primary>
                                                Ok <Icon name='chevron right' />
                                            </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </Grid.Column>
                                <Grid.Column floated='right' width={8}>
                                    <Modal
                                        open={this.state.updateMeal}
                                        onClose={() => this.handleUpdateOpen(false)}
                                        onOpen={() => this.handleUpdateOpen(true)}
                                        trigger={<Button size='tiny' color='black' fluid icon>
                                            Update
                                        </Button>}>
                                        <Modal.Header>Update Your Meal</Modal.Header>
                                        <Modal.Content scrolling>
                                            <Modal.Description>
                                                <MacroGuideModifyModal update={this.state.updated} meals={this.state.meals} />
                                            </Modal.Description>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button size='tiny' onClick={() => this.handleUpdateOpen(false)} secondary>
                                                Cancel <Icon name='chevron right' />
                                            </Button>
                                            <Button size='tiny' onClick={() => this.handleUpdateOpen(false)} primary>
                                                Ok <Icon name='chevron right' />
                                            </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
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
                                    <div><a>Ca</a></div>
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='left'>
                                    <div><a>Pr</a></div>
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='left'>
                                    <div><a>Fa</a></div>
                                </Grid.Column>
                                <Grid.Column width={2} textAlign='left'>
                                    <div><a>FV</a></div>
                                </Grid.Column>
                            </Grid.Row>
                            {this.getRows()}
                        </Grid>
                    </Segment>
                </Grid.Column>
            </Grid>);
    }
}

export default connect()(MacroGuideTable);