import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Menu, Label, Modal, Icon, Progress, Flag, Image, Loader, Dimmer, Divider } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import MacroGuideHeader from './MacroGuideHeader'
import CaloriesRemainingHeader from './CaloriesRemainingHeader'
import MacroGuideReviewModal from './MacroGuideReviewModal'
import MacroGuideTable from './MacroGuideTable'
import { IMacroGuides, IMacrosPlanDto, IMealDto, IMealDetails, IMeals } from '../models/meals';
import { IActivity, IActivityDto } from '../models/activities'
import { IClientDto } from '../models/clients';
import AppsMenu from './AppMenus';
import { isNull } from 'util';

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
    clientDtosUpdated: boolean;
    macrosPlanDtos: IMacrosPlanDto[];
    macrosPlanUpdated: boolean;
    mealDtos: IMealDto[];
    mealDtosUpdated: boolean;
    meals: IMeals;
    updated: boolean;
    savingStatus: string;
    dateChanged: boolean;
    openReview: boolean;
    savingDone: boolean;
    updateAllInfo: boolean;
    activities: IActivity[];
    activityDtos: IActivityDto[];
    activitiesDownloaded: boolean;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class MacroGuide extends React.Component<LoginProps, IState> {

    public componentDidMount() {
        this.props.getLogin();
        
        if (this.props.logins.length > 0) {
            var date = new Date();
            date.setHours(0, 0, 0, 0);
            this.setState({ selectedDate: date, prevDate: date });

            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, clientDtosUpdated: true
                })).catch(error => console.log(error));

            //get macros plan
            fetch('api/client/' + this.props.logins[0].clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlanDto[]>)
                .then(data => this.setState({
                    macrosPlanDtos: data, macrosPlanUpdated: true
                })).catch(error => console.log(error));

            //get all meals
            fetch('api/tracker/' + this.props.logins[0].clientId + '/macrosguide?date=' + date.toISOString())
                .then(response => response.json() as Promise<IMealDto[]>)
                .then(data => this.setState({
                    mealDtos: data, mealDtosUpdated: true
                })).catch(error => console.log(error));

            //get all activities
            fetch('api/tracker/' + this.props.logins[0].clientId + '/activity?date=' + date.toISOString())
                .then(response => response.json() as Promise<IActivityDto[]>)
                .then(data => this.setState({
                    activityDtos: data, activitiesDownloaded: true
                })).catch(error => console.log(error));
        }
    }

    onSubmit = () => {
        this.setState({ username: '', password: '' });
    }

    updateInput = (event: any) => {
        this.setState({ username: event.target.value });
    }

    updateInput2 = (event: any) => {
        this.setState({ password: event.target.value });
    }

    updateMeals = (mealType: number, meals: IMealDetails[]) => {
        this.state.meals[this.getMealTypeIndex(mealType)] = meals;
        this.setState({ meals: this.state.meals, updated: !this.state.updated });
        this.setState({ savingStatus: 'Not Saved' })
    }

    constructor(props: LoginProps) {
        super(props);
        this.updateMeals = this.updateMeals.bind(this);
        this.state = {
            username: '', password: '', activeItem: 'Breakfast',
            selectedDate: new Date(),
            prevDate: new Date(),
            guides: { carb: 0, protein: 0, fat: 0, fruits: 0 },
            meals: { 0: [], 1: [], 2: [], 3: []},
            updated: false,
            clientDtos: [],
            clientDtosUpdated: false,
            macrosPlanDtos: [],
            macrosPlanUpdated: false,
            mealDtos: [],
            mealDtosUpdated: false,
            savingStatus: 'Loading',
            dateChanged: false,
            openReview: false,
            savingDone: false,
            updateAllInfo: false,
            activities: [],
            activityDtos: [],
            activitiesDownloaded: false
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

            let carb = isNull(macrosPlan.carbWeight) ? '0.0' : macrosPlan.carbWeight.toString();
            let protein = isNull(macrosPlan.proteinWeight) ? '0.0' : macrosPlan.proteinWeight.toString();
            let fat = isNull(macrosPlan.fatWeight) ? '0.0' : macrosPlan.fatWeight.toString();

            if (isNull(macrosPlan.manual) || macrosPlan.manual === false) {
                const bmr = (10 * macrosPlan.weight) + (6.25 * macrosPlan.height) - (5 * client.age) - 161;
                const totalCalories = this.getActivityLevel(macrosPlan.activityLevel) * bmr;
                carb = ((macrosPlan.carbPercent / 100.0 * totalCalories) / 4).toFixed(2);
                protein = ((macrosPlan.proteinPercent / 100.0 * totalCalories) / 4).toFixed(2);
                fat = ((macrosPlan.fatPercent / 100.0 * totalCalories) / 9).toFixed(2);
            }

            this.state.guides.carb = parseFloat(carb);
            this.state.guides.protein = parseFloat(protein);
            this.state.guides.fat = parseFloat(fat);
            this.state.guides.fruits = 4;
            this.setState({ guides: this.state.guides });
        }
    }

    deleteMeals = () => {
        var removedMeals: IMealDetails[] = [];
        for (let i = 0; i < 4; i++) {
            var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove === true && x.id !== 0);
            removedMeals.push(...meals);
        }

        removedMeals.forEach(meal => {
            var fetchStr = 'api/tracker/' + meal.id + '/macrosguide/delete';
            fetch(fetchStr, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saving in progress' })).catch(error => console.log('delete meals---------->' + error));
        });
    }

    saveMacrosGuide = () => {
        var fetchStr = 'api/tracker/macrosguides?dateString=' + this.state.selectedDate.toISOString();
        var newMealDtos: IMealDto[] = [];
        for (let i = 0; i < 4; i++) {
            var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove === false);
            meals.forEach(x => {
                newMealDtos.push({
                    id: x.id,
                    food: x.food,
                    mealType: this.getMealTypeString(i),
                    carb: isNaN(parseFloat(x.carb.toString())) ? 0.0 : parseFloat(x.carb.toString()),
                    protein: isNaN(parseFloat(x.protein.toString())) ? 0.0 : parseFloat(x.protein.toString()),
                    fat: isNaN(parseFloat(x.fat.toString())) ? 0.0 : parseFloat(x.fat.toString()),
                    portion: isNaN(parseFloat(x.portion.toString())) ? 0.0 : parseFloat(x.portion.toString()),
                    fv: parseFloat(x.fv.toString()),
                    photo: x.photo,
                    created: this.state.selectedDate.toISOString(),
                    updated: (new Date()).toISOString(),
                    clientId: this.props.logins[0].clientId
                });
            });
        }

        if (newMealDtos.length > 0) {
            fetch(fetchStr, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMealDtos)
            }).then(response => response.json()).then(data => {
                this.logMeals();
                console.log('saving done...');
                this.setState({ savingStatus: 'Saved', savingDone: true })
            }).catch(error => console.log('save  ---------->' + error));
        }
        else {
            console.log('saving done...');
            this.setState({ savingStatus: 'Saved', savingDone: true })
        }
    }

    updateMacrosGuide = () => {
        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/tracker/macrosguides/update?dateString=' + this.state.selectedDate.toISOString();

        var newMealDtos: IMealDto[] = [];
        for (let i = 0; i < 4; i++) {
            var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove === false && x.id !== -1);
            meals.forEach(x => {
                newMealDtos.push({
                    id: x.id,
                    food: x.food,
                    mealType: this.getMealTypeString(i),
                    carb: parseFloat(x.carb.toString()),
                    protein: parseFloat(x.protein.toString()),
                    fat: parseFloat(x.fat.toString()),
                    portion: parseFloat(x.portion.toString()),
                    fv: parseFloat(x.fv.toString()),
                    photo: x.photo,
                    created: this.state.selectedDate.toISOString(),
                    updated: (new Date()).toISOString(),
                    clientId: this.props.logins[0].clientId
                });
            });
        }

        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMealDtos)
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));
    }

    logMeals = () => {
        var fetchStr = 'api/tracker/comment?date=' + this.state.selectedDate.toISOString();
        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0,
                measurementRef: 0,
                mealsRef: 1,
                activitiesRef: 0,
                readStatus: false,
                message: 'Log meals for today',
                created: this.state.selectedDate.toISOString(),
                updated: (new Date()).toISOString(),
                fromId: this.props.logins[0].clientId,
                clientId: 2,
            })
        }).then(response => response.json()).then(data => this.setState({ updated: !this.state.updated })).catch(error => console.log('put macros ---------->' + error));
    }

    onSave = () => {
        this.setState({ savingStatus: 'Saving in progress', mealDtosUpdated: false })

        // delete rows
        var removedMeals: IMealDetails[] = [];
        for (let i = 0; i < 4; i++) {
            var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove === true && x.id !== 0);
            removedMeals.push(...meals);
        }

        if (removedMeals.length > 0) {
            removedMeals.forEach(meal => {
                var fetchStr = 'api/tracker/' + meal.id + '/macrosguide/delete';
                fetch(fetchStr, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(response => response.json()).then(data => {
                    console.log("finished deleting")
                    this.saveMacrosGuide();
                }).catch(error => console.log('delete meals---------->' + error));
            });
        }
        else {
            console.log("start saving")
            this.saveMacrosGuide();
        }
    }

    getMeals = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/macrosguide?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => this.setState({
                mealDtos: data, mealDtosUpdated: true, meals: { 0: [], 1: [], 2: [], 3: [] }
            })).catch(error => console.log(error));
    }

    getActivities = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/activity?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IActivityDto[]>)
            .then(data => this.setState({
                activityDtos: data, activitiesDownloaded: true
            })).catch(error => console.log(error));
    }

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), mealDtos: [], dateChanged: true, mealDtosUpdated: false, activitiesDownloaded: false })
        }
    }

    handlePrevDate = (e: any) => {
        var prevDate = new Date(this.state.selectedDate);
        var date = new Date(this.state.selectedDate);
        var day = this.state.selectedDate.getDate();
        var month = this.state.selectedDate.getMonth();
        var year = this.state.selectedDate.getFullYear();
        
        date.setDate(day - 1);
        date.setHours(0, 0, 0, 0);

        if (date.getDate() > day) {
            date.setMonth(month - 1);
        }

        if (date.getMonth() > month) {
            date.setFullYear(year - 1);
        }

        this.setState({ savingStatus: 'Loading prev day..', selectedDate: new Date(date), mealDtos: [], prevDate: prevDate, dateChanged: true, mealDtosUpdated: false, activitiesDownloaded: false });
    }

    handleNextDate = (e: any) => {
        var prevDate = new Date(this.state.selectedDate);
        var date = new Date(this.state.selectedDate);
        var day = this.state.selectedDate.getDate();
        var month = this.state.selectedDate.getMonth();
        var year = this.state.selectedDate.getFullYear();

        date.setDate(day + 1);
        date.setHours(0, 0, 0, 0);

        if (date.getDate() < day) {
            date.setMonth(month + 1);
        }

        if (date.getMonth() < month) {
            date.setFullYear(year + 1);
        }

        this.setState({ savingStatus: 'Loading next day..', selectedDate: new Date(date), mealDtos: [], prevDate: prevDate, dateChanged: true, mealDtosUpdated: false, activitiesDownloaded: false });
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

    getSaveIcon = () => {
        if (this.state.savingStatus === 'Not Saved') {
            return 'edit outline';
        }

        return 'save';
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
                this.state.meals[this.getMealType(meal.mealType)].push({ id: meal.id, food: meal.food, carb: meal.carb, protein: meal.protein, fat: meal.fat, portion: meal.portion, fv: meal.fv, photo: meal.photo, check: false, remove: false });
            })

            this.setState({ meals: this.state.meals });
        }
    }

    setActivities = () => {
        if (this.state.activityDtos.length > 0) {

            if ((this.state.activities.filter(x => x.id > 0)).length === this.state.activityDtos.length) {
                return;
            }

            var activities: IActivity[] = [];
            this.state.activityDtos.forEach(activity => {
                if (activity.description !== 'sleeps' && activity.description !== 'steps') {
                    activities.push({ id: activity.id, activityDesc: activity.description, calories: activity.calories, steps: activity.steps, maxHr: activity.maxHr, duration: activity.duration, check: false });
                }
            })

            this.setState({ activities: activities });
        }
    }

    onCancel = () => {
        this.setState({ savingStatus: 'Reverting..', mealDtosUpdated: false, updateAllInfo: false });
        this.getMeals();
    }

    showProgressBar = () => {
        if (this.state.savingStatus == 'Saving in progress') {
            return (<Progress inverted color='green' percent={100} active={this.state.savingStatus === 'Saving in progress'}/>);
        }
    }

    getFlag = () => {
        if (this.state.clientDtos.length > 0) {
            var country = this.state.clientDtos[0].city;
            if (country === 'au') {
                return (<Flag name='au' />)
            }

            if (country === 'jp') {
                return (<Flag name='jp' />)
            }

            if (country === 'my') {
                return (<Flag name='my' />)
            }

            if (country === 'us') {
                return (<Flag name='us' />)
            }

            if (country === 'ie') {
                return (<Flag name='ie' />)
            }
        }
    }

    getUserInfo = () => {
        var name = ""
        if (this.state.clientDtos.length > 0) {
            var name = this.state.clientDtos[0].firstName;
        }

        var lastSeen = new Date(this.props.logins[0].lastLogin);
        return name + ', last login: ' + lastSeen.toLocaleDateString();
    }

    getPhoto = () => {
        if (this.state.clientDtos.length > 0) {
            var img = this.state.clientDtos[0].avatar;
            if (img != '') {
                return '/images/avatars/' + img;
            }
        }

        return 'https://react.semantic-ui.com/images/avatar/small/rachel.png';
    }

    isLoadingData = () => {
        if (!this.state.clientDtosUpdated || !this.state.macrosPlanUpdated ||
            !this.state.mealDtosUpdated || !this.state.activitiesDownloaded) {
            return true;
        }

        return false;
    }

    render() {
        var divLabelStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            backgroundColor: 'white'
        };

        var divDateStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        const activeItem = this.state.activeItem;
        if (this.props.logins.length > 0) {
            if (this.state.savingDone || this.state.dateChanged) {
                this.setState({ savingDone: false, dateChanged: false, updateAllInfo: false });
                this.getMeals();
                this.getActivities();
            }

            if (this.isLoadingData()) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content={this.state.savingStatus} />
                    </Dimmer>
                </div>);
            }
            else if (!this.state.updateAllInfo) {
                this.setMacroGuides();
                this.setMeals();
                this.setActivities();
                this.setState({ updateAllInfo: true, updated: !this.state.updated, savingStatus: 'Info Updated' });
            }

            return (
                <div>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <AppsMenu activeParentItem='Nutritions' activeItem='New Meal' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                            </Grid.Column>
                            <Grid.Column width={16} verticalAlign='middle'>
                                <Segment attached='top'>
                                    <div style={divDateStyle}>
                                        <Button className='prev' onClick={this.handlePrevDate} attached='left' icon='chevron left' />
                                        <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                                        <Button className='next' onClick={this.handleNextDate} attached='right' icon='chevron right' />
                                    </div>
                                    <Label corner='right' color={this.getColour()} icon><Icon name={this.getSaveIcon()} /></Label>
                                </Segment>
                                <Segment textAlign='center' attached='bottom'>
                                    <MacroGuideHeader meals={this.state.meals} guides={this.state.guides} activities={this.state.activities} update={this.state.updated} />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={16}>
                                <Menu attached='top' pointing compact>
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
                                    <Grid.Column stretched width={16}>
                                        <MacroGuideTable update={this.state.updated} client={this.state.clientDtos[0]} meals={this.state.meals[this.getMealType(activeItem)]} updateMeals={this.updateMeals} mealType={this.getMealType(this.state.activeItem)} />
                                    </Grid.Column>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={16} textAlign='center' verticalAlign='middle'>
                                <div style={divDateStyle}>
                                    <Button.Group floated='left' fluid>
                                        <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onCancel} ><Icon size='large' name='cancel' color='red' />Cancel</Button>
                                        <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onSave} ><Icon size='large' name='check' color='green' />Save</Button>
                                        <Modal
                                            open={this.state.openReview}
                                            onClose={() => this.handleOpen(false)}
                                            onOpen={() => this.handleOpen(true)}
                                            trigger={<Button labelPosition='left' size='tiny' icon ><Icon size='large' name='spinner' color='blue' />Review</Button>}>
                                            <Modal.Header>Meals Summary for {this.state.selectedDate.toLocaleDateString()}</Modal.Header>
                                            <Modal.Content scrolling>
                                                <Modal.Description>
                                                    <MacroGuideReviewModal senderId={this.props.logins[0].clientId} clientId={this.props.logins[0].clientId} mealDate={this.state.selectedDate.toISOString()} update={this.state.updated} />
                                                </Modal.Description>
                                            </Modal.Content>
                                            <Modal.Actions>
                                                <Button size='tiny' onClick={() => this.handleOpen(false)} primary>
                                                    Close <Icon name='chevron right' />
                                                </Button>
                                            </Modal.Actions>
                                        </Modal>
                                    </Button.Group>
                                </div>
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
)(MacroGuide as any);