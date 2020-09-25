import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Menu, Label, List, Image, Dropdown, Modal, Icon } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import MacroNew from './MacroNew'
import MacroHeader from './MacroHeader'
import MacroModal from './MacroModal'

interface IProps {
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
    selectedDate: Date;
    prevDate: Date;
    guides: IMacroGuides;
    clients: IClient[];
    clientDtos: IClientDto[];
    macrosPlanDtos: IMacrosPlanDto[];
    mealDtos: IMealDto[];
    meals: IMeal[];
    updated: boolean;
    apiUpdate: boolean;
    savingStatus: string;
    dateChanged: boolean;
    openReview: boolean;
    clientId: number;
    clientList: IOption[],
    name: string
}

interface IOption {
    key: string,
    text: string,
    value: string
}

interface IClient {
    id: number
    name: string;
    age: number;
    city: string;
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

interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
}

interface IMealDto {
    id: number;
    mealType: string;
    macroType: string;
    mealDesc: string;
    macroValue: number;
    updated: string;
    created: string;
    clientId: number;
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

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class Master extends React.Component<LoginProps, IState> {

    public componentDidMount() {
        this.props.getLogin();
        this.setState({ selectedDate: new Date(), prevDate: new Date() });

        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get macros plan
            fetch('api/client/' + this.props.logins[0].clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlanDto[]>)
                .then(data => this.setState({
                    macrosPlanDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get all meals
            fetch('api/tracker/' + this.props.logins[0].clientId + '/meals?date=' + (new Date()).toISOString())
                .then(response => response.json() as Promise<IMealDto[]>)
                .then(data => this.setState({
                    mealDtos: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
    }

    onSubmit = () => {
        this.setState({ username: '', password: '' });
    }

    updateInput = (event: any) => {
        this.setState({ username: event.target.value });
        console.log(event.target.value);
    }

    updateInput2 = (event: any) => {
        this.setState({ password: event.target.value });
        console.log(event.target.value);
    }

    updateParentCarb = (mealType: number, carb: IMealDetails[], protein: IMealDetails[], fat: IMealDetails[], veg: IMealDetails[]) => {
        this.state.meals[mealType].carb = carb;
        this.state.meals[mealType].protein = protein;
        this.state.meals[mealType].fat = fat;
        this.state.meals[mealType].fruits = veg;
        this.setState({ updated: !this.state.updated });
        this.setState({ savingStatus: 'Not Saved' })
    }

    constructor(props: LoginProps) {
        super(props);
        this.updateParentCarb = this.updateParentCarb.bind(this);
        this.state = {
            clients: [], username: '', password: '', activeItem: 'Breakfast',
            selectedDate: new Date(),
            prevDate: new Date(),
            guides: { carb: 0, protein: 0, fat: 0, fruits: 0 },
            meals: [{ carb: [], protein: [], fat: [], fruits: [], type: 1 },
                { carb: [], protein: [], fat: [], fruits: [], type: 2 },
                { carb: [], protein: [], fat: [], fruits: [], type: 3 },
                { carb: [], protein: [], fat: [], fruits: [], type: 4 }],
            updated: false,
            clientDtos: [],
            macrosPlanDtos: [],
            mealDtos: [],
            apiUpdate: false,
            savingStatus: 'Saved',
            dateChanged: false,
            openReview: false,
            clientId: 2,
            clientList: [],
            name:''
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    mealTypeDict = { 'Breakfast': 0, 'Lunch': 1, 'Dinner': 2, 'Snack': 3 };

    getMealType = (type:string) =>
    {
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

    setValuesFromDto = () => {
        if (this.state.clients.length === this.state.clientDtos.length) {
            return;
        }

        this.state.clientDtos.forEach(client => {
            this.state.clients.push({ id: client.id, name: client.firstName, age: client.age, city: client.city });
        });
        
        //if (this.state.macrosPlans.length > 0) {
        //    const plan = this.state.macrosPlans[0];
        //    this.state.personal.height = plan.height;
        //    this.state.personal.weight = plan.weight;
        //    this.state.personal.targetWeight = plan.targetWeight;
        //    this.state.personal.carbPercent = plan.carbPercent;
        //    this.state.personal.proteinPercent = plan.proteinPercent;
        //    this.state.personal.fatPercent = plan.fatPercent;
        //    this.state.personal.activityLevel = this.getActivityLevel(plan.activityLevel);
        //    this.state.personal.macroType = this.getMacroType(plan.macroType);
        //    this.setState({ personal: this.state.personal });
        //    console.log(this.state.personal.name);
        //    this.setState({ apiUpdate: false, updated: !this.state.updated });
        //}
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

    setMeals = () => {
        if (this.state.mealDtos.length > 0) {

            var totalMeals = 0;
            this.state.meals.map((item) => {
                totalMeals += item.carb.length;
                totalMeals += item.protein.length;
                totalMeals += item.fat.length;
                totalMeals += item.fruits.length;
            });

            if (totalMeals === this.state.mealDtos.length) {
                return;
            }

            this.state.mealDtos.forEach(meal => {
                if (meal.macroType === 'carb') {
                    console.log(meal);
                    this.state.meals[this.getMealType(meal.mealType)].carb.push({ mealDesc: meal.mealDesc, macro: meal.macroValue, check: false });
                }
                else if (meal.macroType === 'protein') {
                    this.state.meals[this.getMealType(meal.mealType)].protein.push({ mealDesc: meal.mealDesc, macro: meal.macroValue, check: false });
                }
                else if (meal.macroType === 'fat') {
                    this.state.meals[this.getMealType(meal.mealType)].fat.push({ mealDesc: meal.mealDesc, macro: meal.macroValue, check: false });
                }
                else if (meal.macroType === 'fruits') {
                    this.state.meals[this.getMealType(meal.mealType)].fruits.push({ mealDesc: meal.mealDesc, macro: meal.macroValue, check: false });
                }
            })

            this.setState({ meals: this.state.meals });
        }
    }

    getMeals = () => {
        fetch('api/tracker/' + this.state.clientId + '/meals?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => this.setState({
                mealDtos: data, apiUpdate: true
            })).catch(error => console.log(error));

        fetch('api/client/' + this.state.clientId + '/macrosplan')
            .then(response => response.json() as Promise<IMacrosPlanDto[]>)
            .then(data => this.setState({
                macrosPlanDtos: data, apiUpdate: true
            })).catch(error => console.log(error));
    }

    resetMeals = () => {
        this.setState({
            meals: [{ carb: [], protein: [], fat: [], fruits: [], type: 1 },
            { carb: [], protein: [], fat: [], fruits: [], type: 2 },
            { carb: [], protein: [], fat: [], fruits: [], type: 3 },
            { carb: [], protein: [], fat: [], fruits: [], type: 4 }] });
    }

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        newDate.setHours(0, 0, 0, 0);
        console.log(newDate);
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: newDate, mealDtos: [], dateChanged: true, apiUpdate: true })
        }
    }

    handleOpen = (open: boolean) => {
        this.setState({ openReview: open });
    }

    getColour = () => {
        if (this.state.savingStatus === 'Not Saved') {
            return 'red';
        }

        return 'green';
    }

    handleMealsClick = (field: any, value: any) => {
        //console.log(value['checked']);
        //this.state.meals[parseInt(value['className'])]['check'] = value['value'];
        //this.setState({ meals: this.state.meals, updated: true });
        var clientId = parseInt(value['className']);
        this.setState({ clientId: clientId });
    }

    getRows = () => {
        return (
            this.state.clients.map((item, index) =>
                <List.Item key={index}>
                    <Image key={index} avatar src='https://react.semantic-ui.com/images/avatar/small/rachel.png' />
                    <List.Content key={index+1}>
                        <List.Header key={index} as='a'>{item.name}</List.Header>
                        <List.Description key={index + 1}>
                            Age: {item.age} City: {item.city}
                            <Button className={item.id.toString()} key={index + 2} size="small" basic>Meals</Button>
                            <Button className={item.id.toString()} key={index + 3} size="small" basic>Activities</Button>
                    </List.Description>
                    </List.Content>
                </List.Item>
            ));
    }

    setClient = (event: any, data: any) => {
        console.log(data);
        this.setState({ updated: true, clientId: data['value'] });
        this.setState({ dateChanged: true })
    }

    render() {
        var divLabelStyle = {
            color: '#fffafa',
            backgroundColor: this.getColour()
        };

        const activeItem = this.state.activeItem;
        console.log(this.state.meals);
        if (this.props.logins.length > 0) {
            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false });
                this.resetMeals();
                this.getMeals();

                if (this.state.clientId != 0) {
                    if (this.state.clientList.find(x => x.key === this.state.clientId.toString())) {
                        const cname = this.state.clientList[this.state.clientList.findIndex(x => x.key === this.state.clientId.toString())].text;
                        this.setState({ name: cname });
                    }
                }
            }

            if (this.state.apiUpdate === true) {
                this.setState({ apiUpdate: false, updated: !this.state.updated });
                this.setValuesFromDto();
                if (this.state.clientList.length < 1) {
                    this.state.clientDtos.forEach(client => {
                        this.state.clientList.push({ key: client.id.toString(), text: client.firstName, value: client.id.toString() });
                    });
                }
                this.setMacroGuides();
                this.setMeals();
            }
            return (
                <div>
                    <Grid centered>
                        <Grid.Row columns={2}>
                            <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                                <Label size='large' as='a' color='pink' tag>Master View</Label>
                            </Grid.Column>
                            <Grid.Column verticalAlign='middle' floated='right' textAlign='right'>
                                <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row textAlign='left' columns={2}>
                            <Grid.Column floated='left'>
                                <Dropdown id='activities' value={this.state.clientId} selection options={this.state.clientList} onChange={this.setClient} />
                            </Grid.Column>
                            <Grid.Column floated='left'>
                                <Modal
                                    open={this.state.openReview}
                                    onClose={() => this.handleOpen(false)}
                                    onOpen={() => this.handleOpen(true)}
                                    trigger={<Button size='tiny' primary>Review</Button>}>
                                    <Modal.Header> {this.state.name}: {this.state.selectedDate.toLocaleDateString()}</Modal.Header>
                                    <Modal.Content scrolling>
                                        <Modal.Description>
                                            <MacroModal guides={this.state.guides} meals={this.state.meals} update={this.state.updated} />
                                        </Modal.Description>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button size='tiny' onClick={() => this.handleOpen(false)} primary>
                                            Close <Icon name='chevron right' />
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>);
        }
        return (<Redirect to="/" />);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Master as any);