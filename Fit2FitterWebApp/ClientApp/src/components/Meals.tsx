import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Menu, Label, Modal, Icon } from 'semantic-ui-react'
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
    clientDtos: IClientDto[];
    macrosPlanDtos: IMacrosPlanDto[];
    mealDtos: IMealDto[];
    meals: IMeal[];
    updated: boolean;
    apiUpdate: boolean;
    savingStatus: string;
    dateChanged: boolean;
    openReview: boolean;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface ITotalDailyMacro {
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

class Meals extends React.Component<LoginProps, IState> {

    public componentDidMount() {
        this.props.getLogin();
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        this.setState({ selectedDate: date, prevDate: date });

        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
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
            fetch('api/tracker/' + this.props.logins[0].clientId + '/meals?date=' + date.toISOString())
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
            username: '', password: '', activeItem: 'Breakfast',
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

    saveCarb = (mealType: number) => {
        if (this.state.meals[mealType].carb.length < 1) {
            this.setState({ savingStatus: 'Saved' })
            return;
        }

        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/tracker/meal?date=' + this.state.selectedDate.toISOString();

        this.state.meals[mealType].carb.forEach(macro => {
            fetch(fetchStr, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: 0,
                    MealType: this.getMealTypeString(mealType),
                    MacroType: 'carb',
                    MealDesc: macro.mealDesc,
                    MacroValue: parseFloat(macro.macro.toString()),
                    Updated: new Date(),
                    Created: this.state.selectedDate.toISOString(),
                    ClientId: this.props.logins[0].clientId,
                })
            }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));
        });
    }

    saveProtein = (mealType: number) => {
        if (this.state.meals[mealType].protein.length < 1) {
            this.setState({ savingStatus: 'Saved' })
            return;
        }

        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/tracker/meal?date=' + this.state.selectedDate.toISOString();

        this.state.meals[mealType].protein.forEach(macro => {
            fetch(fetchStr, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: 0,
                    MealType: this.getMealTypeString(mealType),
                    MacroType: 'protein',
                    MealDesc: macro.mealDesc,
                    MacroValue: parseFloat(macro.macro.toString()),
                    Updated: new Date(),
                    Created: this.state.selectedDate.toISOString(),
                    ClientId: this.props.logins[0].clientId,
                })
            }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));
        });
    }

    saveFat = (mealType: number) => {
        if (this.state.meals[mealType].fat.length < 1) {
            this.setState({ savingStatus: 'Saved' })
            return;
        }

        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/tracker/meal?date=' + this.state.selectedDate.toISOString();

        this.state.meals[mealType].fat.forEach(macro => {
            fetch(fetchStr, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: 0,
                    MealType: this.getMealTypeString(mealType),
                    MacroType: 'fat',
                    MealDesc: macro.mealDesc,
                    MacroValue: parseFloat(macro.macro.toString()),
                    Updated: new Date(),
                    Created: this.state.selectedDate.toISOString(),
                    ClientId: this.props.logins[0].clientId,
                })
            }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));
        });
    }

    saveFruits = (mealType: number) => {
        if (this.state.meals[mealType].fruits.length < 1) {
            this.setState({ savingStatus: 'Saved' })
            return;
        }

        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/tracker/meal?date=' + this.state.selectedDate.toISOString();

        this.state.meals[mealType].fruits.forEach(macro => {
            fetch(fetchStr, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: 0,
                    MealType: this.getMealTypeString(mealType),
                    MacroType: 'fruits',
                    MealDesc: macro.mealDesc,
                    MacroValue: parseFloat(macro.macro.toString()),
                    Updated: new Date(),
                    Created: this.state.selectedDate.toISOString(),
                    ClientId: this.props.logins[0].clientId,
                })
            }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));
        });
    }

    deleteMeals = () => {
        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/tracker/' + this.props.logins[0].clientId + '/meal/delete?date=' + this.state.selectedDate.toISOString();
        fetch(fetchStr, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saving in progress' })).catch(error => console.log('delete meals---------->' + error));
    }

    onCancel = () => {
        this.resetMeals();
        this.setMacroGuides();
        this.setMeals();
        this.setState({ updated: !this.state.updated });
    }

    onSave = () => {
        // delete rows
        this.deleteMeals();

        // add rows
        setTimeout(() => {
            for (let i = 0; i < 4; i++) {
                this.saveCarb(i);
                this.saveProtein(i);
                this.saveFat(i);
                this.saveFruits(i);
            }
        }, 2000);
    }

    getMeals = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/meals?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => this.setState({
                mealDtos: data, apiUpdate: true
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
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), mealDtos: [], dateChanged: true, apiUpdate: true })
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
            }

            if (this.state.apiUpdate === true) {
                this.setState({ apiUpdate: false, updated: !this.state.updated });
                this.setMacroGuides();
                this.setMeals();
            }
            return (
                <div>
                    <Grid centered>
                        <Grid.Row columns={2}>
                            <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                                <Label size='large' as='a' color='pink' basic circular>Daily Meals Tracker</Label>
                            </Grid.Column>
                            <Grid.Column verticalAlign='middle' floated='right' textAlign='right'>
                                <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment textAlign='center' attached='bottom'>
                                    <MacroHeader meals={this.state.meals} guides={this.state.guides} update={this.state.updated} />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Menu attached='top' tabular compact>
                                    <Menu.Item
                                        name='Breakfast'
                                        active={activeItem === 'Breakfast'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Lunch'
                                        active={activeItem === 'Lunch'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Dinner'
                                        active={activeItem === 'Dinner'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Snack'
                                        active={activeItem === 'Snack'}
                                        onClick={this.handleItemClick}
                                    />
                                </Menu>

                                <Segment attached='bottom'>
                                    <MacroNew updateParentCarb={this.updateParentCarb} meal={this.state.meals[this.getMealType(activeItem)]} guides={this.state.guides} update={this.state.updated} />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column verticalAlign='middle' width={16} textAlign='center' floated='left'>
                                <div style={divLabelStyle}>
                                    <a>{this.state.savingStatus}</a>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={3}>
                            <Grid.Column width={4} textAlign='left' floated='left'>
                                <Button floated='left' size='tiny' onClick={this.onCancel} secondary>Cancel</Button>
                            </Grid.Column>
                            <Grid.Column width={4} textAlign='left' floated='left'>
                                <Button floated='left' size='tiny' onClick={this.onSave} primary>Save</Button>
                            </Grid.Column>
                            <Grid.Column verticalAlign='middle' width={4} textAlign='left' floated='left'>
                            </Grid.Column>
                            <Grid.Column width={4} textAlign='right' floated='right'>
                                <Modal
                                    open={this.state.openReview}
                                    onClose={() => this.handleOpen(false)}
                                    onOpen={() => this.handleOpen(true)}
                                    trigger={<Button size='tiny' primary>Review</Button>}>
                                    <Modal.Header>Meals Summary for {this.state.selectedDate.toLocaleDateString()}</Modal.Header>
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

    private getLoginCredentials = () => {
        this.props.requestLogins(this.state.username, this.state.password);
    }

    private clearCredentials = () => {
        this.props.requestLogout(this.state.username, this.state.password);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Meals as any);