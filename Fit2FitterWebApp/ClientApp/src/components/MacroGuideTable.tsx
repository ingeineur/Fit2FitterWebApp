import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Popup, Form, Input, Grid, Label, Icon, Segment, Checkbox, Modal, Radio } from 'semantic-ui-react'
import MacroGuideModal from './MacroGuideModal'
import MacroGuideModifyModal from './MacroGuideModifyModal'
import { isNullOrUndefined } from 'util';
import { IMealDto, IMealDetails } from '../models/meals';
import { IClientDto } from '../models/clients';

interface IProps {
    meals: IMealDetails[] 
    update: boolean;
    mealType: number;
    updateMeals: Function;
    client: IClientDto;
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
    updateDetails: IUpdateMeal;
}

interface IUpdateMeal {
    meal: IMealDetails;
    index: number;
}

class MacroGuideTable extends React.Component<IProps, IState> {

    addMeal = (meals: IMealDetails[]) => {
        while (this.state.addedMeals.length > 0) {
            this.state.addedMeals.pop();
        }
        meals.forEach(x => this.state.addedMeals.push(x));
        this.setState({ addedMeals: this.state.addedMeals });
    }

    updateMeal = (index: number, meal: IMealDetails) => {
        this.setState({ updateDetails: { index: index, meal: meal } });
    }

    constructor(props: IProps) {
        super(props);
        this.addMeal = this.addMeal.bind(this);
        this.updateMeal = this.updateMeal.bind(this);
        this.state = {
            username: '', password: '', updated: false, mealType: 1, meals: [],
            dirty: false, openAddMeal: false, updateMeal: false, addedMeals: [],
            updateDetails: { index: -1, meal: { id: 0, food: '', carb: 0, protein: 0, fat: 0, fv: 0, photo:'', check: false, remove: false } }
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
        const re = /^[-+,0-9,\.]+$/;
        if (value['value'] === '' || re.test(value['value'])) {
            this.state.meals[parseInt(value['className'])]['carb'] = value['value'];
            this.setState({ meals: this.state.meals, updated: true });
        }
    }

    handleCheckChange = (field: any, value: any) => {
        this.state.meals.forEach(x => x.check = false);
        var arr = this.state.meals.filter(x => x.remove !== true);
        arr[parseInt(value['className'])]['check'] = value['checked'];
        this.setState({ meals: this.state.meals, updated: true });
    }

    getPhotoIndicator = (photo: string, index: number) => {
        if (isNullOrUndefined(photo) || photo === '') {
            return(<div/>);
        }
        return (<Label size='tiny' key={this.props.mealType + index + 100} as='a' corner='right'>
            <Icon key={this.props.mealType + index + 100} color='blue' size='tiny' name='camera' />
        </Label>);
    }

    getRows = () => {
        var arr = this.state.meals.filter(x => x.remove !== true);
        return (
            arr.map((item, index) =>
                <Grid.Row className={'row'} key={this.props.mealType + index} columns={3} stretched>
                    {this.getPhotoIndicator(item.photo, index)}
                    <Grid.Column className={'col_checkbox'} key={this.props.mealType + index} width={2} verticalAlign='middle' textAlign='center'>
                        <Radio className={index.toString()} checked={item.check} key={index} onChange={this.handleCheckChange} />
                    </Grid.Column>
                    <Grid.Column className={'col_food'} key={this.props.mealType + index + 1} width={6}>
                        <a key={this.props.mealType + index + 1}>{item.food}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_carb'} key={this.props.mealType + index + 2} width={2}>
                        <a key={this.props.mealType + index + 2}>{parseFloat(item.carb.toString()).toFixed(2)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_protein'} key={this.props.mealType + index + 3} width={2}>
                        <a key={this.props.mealType + index + 3}>{parseFloat(item.protein.toString()).toFixed(2)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fat'} key={this.props.mealType + index + 4} width={2}>
                        <a key={this.props.mealType + index + 4}>{parseFloat(item.fat.toString()).toFixed(2)}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_fv'} key={this.props.mealType + index + 5} width={2}>
                        <a key={this.props.mealType + index + 5}>{item.fv}</a>
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    removeActivities = (event: any) => {
        var arr: IMealDetails[] = [];
        this.state.meals.forEach(obj => {
            if (obj.check === true) {
                obj.remove = true;
                arr.push(obj);
            }
            else if (obj.check === false) {
                arr.push(obj);
            }
        });
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
        this.setState({ updated: true, openAddMeal: open, addedMeals: this.state.addedMeals, meals: this.state.meals });
    }

    handleCancelAdd = (open: boolean) => {
        while (this.state.addedMeals.length > 0) {
            this.state.addedMeals.pop();
        }

        this.setState({ openAddMeal: open, addedMeals: this.state.addedMeals });
    }

    handleUpdate = (open: boolean) => {
        if (this.state.updateDetails.index > -1 && this.state.updateDetails.index < this.state.meals.length) {
            this.state.meals[this.state.updateDetails.index] = this.state.updateDetails.meal;
            console.log(this.state.updateDetails);
            this.state.updateDetails.index = -1;
            this.setState({ updated: true, meals: this.state.meals, updateDetails: this.state.updateDetails });
        }

        this.setState({ updateMeal: open });
    }

    handleUpdateOpen = (open: boolean) => {
        this.setState({ updateMeal: open });
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

    autoPopulateFromYesterday = () => {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(0, 0, 0, 0);

        //get all meals
        fetch('api/tracker/' + this.props.client.id + '/macrosguide?date=' + date.toISOString())
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => {
                data.forEach(meal => {
                    if (this.getMealType(meal.mealType) === this.props.mealType) {
                        this.state.meals.push({ id: 0, food: meal.food, carb: meal.carb, protein: meal.protein, fat: meal.fat, fv: meal.fv, photo: meal.photo, check: false, remove: false });
                    }
                    this.setState({ meals: this.state.meals, updated: true });
                });
            }).catch(error => console.log(error));
    }

    render() {

        if (this.state.mealType !== this.props.mealType)
        {
            this.setState({ meals: this.props.meals, mealType: this.props.mealType });
        }
        else if (this.props.update !== this.state.dirty) {
            this.setState({ meals: this.props.meals, mealType: this.props.mealType, dirty: this.props.update });
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
                            <Grid.Row columns={4}>
                                <Grid.Column width={3} floated='left'>
                                    <Button size='tiny' color='red' fluid icon onClick={this.removeActivities}>
                                        <Icon name='minus' />
                                    </Button>
                                </Grid.Column>
                                <Grid.Column width={3} floated='left'>
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
                                                <MacroGuideModal client={this.props.client} addMeal={this.addMeal} update={this.state.updated} />
                                            </Modal.Description>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button size='tiny' onClick={() => this.handleCancelAdd(false)} secondary>
                                                Cancel <Icon name='chevron right' />
                                            </Button>
                                            <Button size='tiny' onClick={() => this.handleAdd(false)} primary>
                                                Proceed <Icon name='chevron right' />
                                            </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </Grid.Column>
                                <Grid.Column width={5} floated='left'>
                                    <Popup content='Auto populate from yesterday' trigger={<Button size='tiny' basic color='pink' fluid icon onClick={this.autoPopulateFromYesterday}>
                                        Auto
                                    </Button>} />
                                </Grid.Column>
                                <Grid.Column width={5} floated='right'>
                                    <Modal
                                        open={this.state.updateMeal}
                                        onClose={() => this.handleUpdateOpen(false)}
                                        onOpen={() => this.handleUpdateOpen(true)}
                                        trigger={<Button size='tiny' basic color='pink' fluid icon>
                                            Modify
                                        </Button>}>
                                        <Modal.Header>Update Your Meal</Modal.Header>
                                        <Modal.Content scrolling>
                                            <Modal.Description>
                                                <MacroGuideModifyModal updateMeal={this.updateMeal} update={this.state.updated} meals={this.state.meals} />
                                            </Modal.Description>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button size='tiny' onClick={() => this.handleUpdateOpen(false)} secondary>
                                                Cancel <Icon name='chevron right' />
                                            </Button>
                                            <Button size='tiny' onClick={() => this.handleUpdate(false)} primary>
                                                Proceed <Icon name='chevron right' />
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