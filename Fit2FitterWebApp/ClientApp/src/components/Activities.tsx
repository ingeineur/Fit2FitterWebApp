import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Progress, Label, Input, Icon, Image, Loader, Dimmer, Divider, Header } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import ActivityWorkoutTable from './ActivityWorkoutTable';
import ActivityHeader from './ActivityHeader';
import AppsMenu from './AppMenus';
import { IActivityGuides, ITotalDailyActivity, IActivity, IActivityDto, getStepIndicatorColour, getSleepColour } from '../models/activities'
import { IMacroGuides, IMealDto, IMeals, IMealDetails, IMacrosPlanDto } from '../models/meals'
import { IClientDto } from '../models/clients';
import CaloriesRemainingHeader from './CaloriesRemainingHeader'
import { isNull } from 'util';
import './signin.css';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    selectedDate: Date;
    prevDate: Date;
    guides: IActivityGuides;
    totalActivities: ITotalDailyActivity;
    activities: IActivity[];
    removedActivities: IActivity[];
    activityDtos: IActivityDto[];
    activityDtosUpdated: boolean;
    updated: boolean;
    savingStatus: string;
    dateChanged: boolean;
    clients: IClientDto[];
    clientsUpdated: boolean;
    age: number;
    steps: number;
    sleeps: number;
    status: string,
    stepsStatus: string,
    sleepsStatus: string,
    workoutUpdated: boolean;
    savingDone: boolean;
    updateAllInfo: boolean;
    meals: IMeals;
    mealDtos: IMealDto[];
    macrosPlanDtos: IMacrosPlanDto[];
    mealGuides: IMacroGuides;
    mealsDownloaded: boolean;
    macrosPlanDownloaded: boolean;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class Activities extends React.Component<LoginProps, IState> {

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
                    clients: data, clientsUpdated: true
                })).catch(error => console.log(error));

            //get all activities
            fetch('api/tracker/' + this.props.logins[0].clientId + '/activity?date=' + date.toISOString())
                .then(response => response.json() as Promise<IActivityDto[]>)
                .then(data => this.setState({
                    activityDtos: data, activityDtosUpdated: true
                })).catch(error => console.log(error));

            //get macros plan
            fetch('api/client/' + this.props.logins[0].clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlanDto[]>)
                .then(data => this.setState({
                    macrosPlanDtos: data, macrosPlanDownloaded: true
                })).catch(error => console.log(error));

            //get all meals
            fetch('api/tracker/' + this.props.logins[0].clientId + '/macrosguide?date=' + date.toISOString())
                .then(response => response.json() as Promise<IMealDto[]>)
                .then(data => this.setState({
                    mealDtos: data, mealsDownloaded: true
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

    addActivity = (event: any) => {
        this.state.activities.push({ id:0, activityDesc: '', steps: 0, calories: 0, maxHr: 0, duration: 0, check: false });
        this.setState({ updated: !this.state.updated });
    }

    removeActivities = (event: any) => {
        var arr = this.state.activities.filter(obj => obj.check === false);
        var removed = this.state.activities.filter(obj => obj.check === true);
        console.log(arr);
        console.log(this.state.activities);
        console.log(removed);
        this.setState({ updated: !this.state.updated, activities: arr, removedActivities: removed, workoutUpdated: true });
    }

    updateActivities = (input:IActivity[]) => {
        this.setState({
            activities: input
        });
        this.setState({ updated: !this.state.updated, savingStatus: 'Not Saved', workoutUpdated: true });
    }

    constructor(props: LoginProps) {
        super(props);
        this.updateActivities = this.updateActivities.bind(this);
        this.state = {
            username: '', password: '',
            selectedDate: new Date(),
            prevDate: new Date(),
            guides: { calories: 300, steps: 10000 },
            totalActivities: { calories: 0, steps: 0 },
            activities: [],
            removedActivities: [],
            activityDtos: [],
            activityDtosUpdated: false,
            updated: false,
            savingStatus: 'Loading',
            dateChanged: false,
            clients: [],
            clientsUpdated: false,
            age: 0,
            sleeps: 0,
            steps: 0,
            status: "test",
            workoutUpdated: false,
            stepsStatus: '',
            sleepsStatus: '',
            savingDone: false,
            updateAllInfo: false,
            meals: { 0: [], 1: [], 2: [], 3: [] },
            mealDtos: [],
            macrosPlanDtos: [],
            mealGuides: { carb: 0, protein: 0, fat: 0, fruits: 0 },
            mealsDownloaded: false,
            macrosPlanDownloaded: false
        };
    }

    setActivities = () => {
        if (this.state.activityDtos.length > 0) {

            if ((this.state.activities.filter(x => x.id > 0)).length === this.state.activityDtos.length) {
                return;
            }

            var activities: IActivity[] = [];
            var steps: number = 0;
            var sleeps: number = 0.0;

            var index = this.state.activityDtos.findIndex(x => x.description === 'steps')
            if (index >= 0) {
                var stepsActivity = this.state.activityDtos[index];
                steps = stepsActivity.steps;
                activities.push({ id: stepsActivity.id, activityDesc: stepsActivity.description, calories: stepsActivity.calories, steps: stepsActivity.steps, maxHr: stepsActivity.maxHr, duration: stepsActivity.duration, check: false });
            }

            index = this.state.activityDtos.findIndex(x => x.description === 'sleeps')
            if (index >= 0) {
                var sleepsActivity = this.state.activityDtos[index];
                sleeps = sleepsActivity.duration;
                activities.push({ id: sleepsActivity.id, activityDesc: sleepsActivity.description, calories: sleepsActivity.calories, steps: sleepsActivity.steps, maxHr: sleepsActivity.maxHr, duration: sleepsActivity.duration, check: false });
            }

            this.state.activityDtos.forEach(activity => {
                if (activity.description !== 'sleeps' && activity.description !== 'steps') {
                    activities.push({ id: activity.id, activityDesc: activity.description, calories: activity.calories, steps: activity.steps, maxHr: activity.maxHr, duration: activity.duration, check: false });
                }
            })

            this.setState({ activities: activities, steps: steps, stepsStatus: this.getStepsStatus(steps), sleeps: sleeps, sleepsStatus: this.getSleepsStatus(sleeps) });
        }
        else {
            var activities: IActivity[] = [];
            activities.push({ id: 0, activityDesc: 'steps', calories: 0, steps: 0, maxHr: 0, duration: 0.0, check: false });
            activities.push({ id: 0, activityDesc: 'sleeps', calories: 0, steps: 0, maxHr: 0, duration: 0.0, check: false });
            this.setState({ steps: 0, sleeps: 0.0, activities: activities, stepsStatus: this.getStepsStatus(0), sleepsStatus: this.getSleepsStatus(0.0) });
        }
    }

    deleteActivitiesByIds = () => {
        var activityIds: number[] = [];
        this.state.removedActivities.forEach(x => {
            if (x.id != 0) {
                activityIds.push(x.id);
            }
        });

        if (activityIds.length < 1) {
            return;
        }

        var fetchStr = 'api/tracker/' + this.props.logins[0].clientId + '/activity/delete';
        fetch(fetchStr, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activityIds)
        }).then(response => response.json()).then(data => {
            this.setState({ savingStatus: 'Delete Completed' })
            this.saveActivities();
        }).catch(error => console.log('delete and save meals---------->' + error));
    }

    saveActivities = () => {
        if (this.state.activities.length < 1) {
            this.setState({ savingStatus: 'Saved' })
            return;
        }

        var fetchStr = 'api/tracker/activity?date=' + this.state.selectedDate.toISOString();

        console.log(this.state.activities);
        this.state.activities.forEach(activity => {
            fetch(fetchStr, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: activity.id,
                    Calories: activity.calories,
                    Steps: activity.steps,
                    MaxHr: activity.maxHr,
                    Duration: activity.duration,
                    Description: activity.activityDesc,
                    Updated: new Date(),
                    Created: this.state.selectedDate.toISOString(),
                    ClientId: this.props.logins[0].clientId,
                })
            }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved', savingDone: true })).catch(error => console.log('put macros ---------->' + error));
        });
    }

    onCancel = () => {
        this.resetActivities();
        this.setState({ updateAllInfo: false, updated: !this.state.updated });
    }

    onSave = () => {
        this.setState({ savingStatus: 'Saving in progress', activityDtosUpdated: false })

        if (this.state.removedActivities.length > 0) {
            // delete rows, then save
            this.deleteActivitiesByIds();
        }
        else {
            this.saveActivities();
        }
    }

    getActivities = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/activity?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IActivityDto[]>)
            .then(data => this.setState({
                activityDtos: data, activityDtosUpdated: true, updateAllInfo: false
            })).catch(error => console.log(error));
    }

    resetActivities = () => {
        while (this.state.activities.length > 0) {
            this.state.activities.pop();
        }

        this.setState({
            activities: this.state.activities
        });
    }

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({
                selectedDate: new Date(field['value']), activityDtos: [], dateChanged: true,
                activityDtosUpdated: false, mealsDownloaded: false, mealDtos: []
            })
        }
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

    getStepsStatus = (steps: number) => {
        var status = 'Keep Moving';
        if (steps >= this.state.guides.steps) {
            status = 'Excellent!! Target Achieved';
        }
        else if (steps > this.state.guides.steps / 2) {
            status = 'Great!! Almost There';
        }
        return status;
    } 

    updateSteps = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            var index = this.state.activities.findIndex(x => x.activityDesc === 'steps');
            if (index > -1) {
                this.state.activities[index].steps = parseInt(event.target.value);
            }

            this.setState({ activities: this.state.activities, steps: event.target.value, stepsStatus: this.getStepsStatus(event.target.value), savingStatus: 'Not Saved', updated: true });
        }
    }

    getSleepsStatus = (sleeps: number) => {
        var status = 'You need more rest';
        if (sleeps >= 6.5) {
            status = 'Excellent!! Your Body is Well Rested';
        }
        
        return status;
    }

    updateSleeps = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            var index = this.state.activities.findIndex(x => x.activityDesc === 'sleeps');
            if (index > -1) {
                this.state.activities[index].duration = parseFloat(event.target.value);
            }
            this.setState({ activities: this.state.activities, sleeps: event.target.value, sleepsStatus: this.getSleepsStatus(event.target.value), savingStatus: 'Not Saved', updated: true });
        }
    }

    getMaxHr = () => {
        var maxHr: number = Math.max.apply(Math, this.state.activities.map(function (o) { return o.maxHr; }));
        if (this.state.activities.length < 1) {
            maxHr = 0;
        }

        return maxHr;
    }

    getHeartRateStatus = () => {
        var maxHr = this.getMaxHr();

        if (maxHr > (220 - this.state.age)) {
            return 'Warning!!!: Exceeding your max heart-rate is not advisable';
        }
        else if (maxHr === (220 - this.state.age)) {
            return 'Awesome!!!: Your body will keep burning for the next 24 Hours';
        }
        else if (maxHr > (0.65 * (220 - this.state.age))) {
            return 'Excellent: Your body will keep burning for the next 12 Hours';
        }
        else if (maxHr > 0) {
            return 'Great work so far';
        }
        else {
            return 'No MAX HR detected!!';
        }
    }

    getMaxHrColour = (maxHr: number) => {
        var calcMaxHr = 220 - this.state.age;
        var minMaxHr = 0.65 * calcMaxHr;
        var maxMaxHr = 0.85 * calcMaxHr;

        if (maxHr >= minMaxHr && maxHr <= maxMaxHr) {
            return 'green';
        }
        else if (maxHr > maxMaxHr && maxHr <= calcMaxHr) {
            return 'orange';
        }

        return 'red';
    }

    showProgressBar = () => {
        if (this.state.savingStatus == 'Saving in progress') {
            return (<Progress inverted color='green' percent={100} active={this.state.savingStatus === 'Saving in progress'}/>);
        }
    }

    getUserInfo = () => {
        var name = ""
        if (this.state.clients.length > 0) {
            var name = this.state.clients[0].firstName;
        }

        var lastSeen = new Date(this.props.logins[0].lastLogin);
        return name + ', last login: ' + lastSeen.toLocaleDateString();
    }

    getPhoto = () => {
        if (this.state.clients.length > 0) {
            var img = this.state.clients[0].avatar;
            if (img != '') {
                return '/images/avatars/' + img;
            }
        }

        return 'https://react.semantic-ui.com/images/avatar/small/rachel.png';
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

        this.setState({
            selectedDate: new Date(date), activityDtos: [], prevDate: prevDate, dateChanged: true,
            activityDtosUpdated: false, mealsDownloaded: false, mealDtos: []
        });
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

        this.setState({
            selectedDate: new Date(date), activityDtos: [], prevDate: prevDate, dateChanged: true,
            activityDtosUpdated: false, mealsDownloaded: false, mealDtos: []
        });
    }

    isLoadingData = () => {
        if (!this.state.clientsUpdated || !this.state.activityDtosUpdated ||
            !this.state.mealsDownloaded || !this.state.macrosPlanDownloaded) {
            return true;
        }

        return false;
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
        if (this.state.macrosPlanDtos.length > 0 && this.state.clients.length > 0) {
            const client = this.state.clients[0];
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

            this.state.mealGuides.carb = parseFloat(carb);
            this.state.mealGuides.protein = parseFloat(protein);
            this.state.mealGuides.fat = parseFloat(fat);
            this.state.mealGuides.fruits = 4;
            this.setState({ mealGuides: this.state.mealGuides });
        }
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
                this.state.meals[this.getMealType(meal.mealType)].push({ id: meal.id, food: meal.food, carb: meal.carb, protein: meal.protein, fat: meal.fat, portion: meal.portion, fv: meal.fv, photo: meal.photo, check: false, remove: false });
            })

            this.setState({ meals: this.state.meals });
        }
    }

    getMeals = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/macrosguide?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => this.setState({
                mealDtos: data, mealsDownloaded: true
            })).catch(error => console.log(error));
    }

    resetMeals = () => {
        this.setState({
            meals: { 0: [], 1: [], 2: [], 3: [] }
        });
    }

    render() {
        if (this.props.logins.length > 0) {
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

            if (this.state.savingDone === true || this.state.dateChanged === true) {
                this.setState({ savingDone: false, dateChanged: false, updateAllInfo: false });
                this.resetActivities();
                this.getActivities();
                this.resetMeals();
                this.getMeals();
            }

            if (this.state.workoutUpdated === true) {
                this.setState({ workoutUpdated: false });
            }

            if (this.isLoadingData()) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content={this.state.savingStatus} />
                    </Dimmer>
                </div>);
            }
            else if (!this.state.updateAllInfo) {
                this.setActivities();
                this.setMacroGuides();
                this.setMeals();
                if (this.state.clients.length > 0) {
                    const client = this.state.clients[0];
                    this.setState({ age: client.age });
                }

                this.setState({ updateAllInfo: true, updated: !this.state.updated });
            }

        return (
            <div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <AppsMenu activeItem='Activity' logins={this.props.logins} clientDtos={this.state.clients} />
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
                                <ActivityHeader age={this.state.age} activities={this.state.activities} steps={this.state.steps} sleeps={this.state.sleeps} guides={this.state.guides} update={this.state.updated} />
                            </Segment>
                            <CaloriesRemainingHeader meals={this.state.meals} guides={this.state.mealGuides} activities={this.state.activities} update={this.state.updated} />
                        </Grid.Column>
                        <Grid.Column width={16} verticalAlign='middle'>
                            <Segment>
                                <Grid textAlign='center' centered>
                                    <Grid.Row columns={3} verticalAlign='middle'>
                                        <Grid.Column textAlign='center'>
                                            <Icon name='paw' size='big' color={getStepIndicatorColour(this.state.steps / this.state.guides.steps)} />
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <Icon name='heartbeat' size='big' color={this.getMaxHrColour(this.getMaxHr())} />
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <Icon name='hotel' size='big' color={getSleepColour(this.state.sleeps)} />
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <div><a className='text-table-row'>Steps Count: {this.state.stepsStatus}</a></div>
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <div><a className='text-table-row'>{this.getHeartRateStatus()}</a></div>
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <div><a className='text-table-row'>Sleep Hours: {this.state.sleepsStatus}</a></div>
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <Input as='a' fluid size='mini' value={this.state.steps} placeholder='Steps Count' onChange={this.updateSteps} />
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <div><Label color='black' horizontal>{this.getMaxHr()}</Label></div>
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <Input size='mini' fluid value={this.state.sleeps} placeholder='Sleep Hours' onChange={this.updateSleeps} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={16} verticalAlign='middle'>
                            <Segment attached='top'>
                                <Grid centered>
                                    <Grid.Row columns={5}>
                                        <Grid.Column floated='left'>
                                            <Button circular size='tiny' fluid icon onClick={this.removeActivities}>
                                                <Icon name='minus' color='black' />
                                            </Button>
                                        </Grid.Column>
                                        <Grid.Column floated='right'>
                                            <Button circular size='tiny' fluid icon onClick={this.addActivity}>
                                                <Icon name='plus' color='black' />
                                            </Button>
                                        </Grid.Column>
                                        <Grid.Column verticalAlign='middle'>
                                            <h2>Workouts</h2>
                                        </Grid.Column>
                                        <Grid.Column>
                                        </Grid.Column>
                                        <Grid.Column>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Segment textAlign='center' attached='bottom'>
                                <ActivityWorkoutTable updateActivities={this.updateActivities} activities={this.state.activities} guides={this.state.guides} update={this.state.updated} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left' floated='left'>
                            <div style={divDateStyle}>
                                <Button.Group floated='left' fluid>
                                    <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onCancel} ><Icon size='large' name='cancel' color='red' />Cancel</Button>
                                    <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onSave} ><Icon size='large' name='check' color='green' />Save</Button>
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

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Activities as any);