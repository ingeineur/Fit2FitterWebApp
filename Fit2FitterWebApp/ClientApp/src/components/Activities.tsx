import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Progress, Label, Input, Icon } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import ActivityWorkoutTable from './ActivityWorkoutTable'
import ActivityHeader from './ActivityHeader'

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
    updated: boolean;
    apiUpdate: boolean;
    savingStatus: string;
    dateChanged: boolean;
    clients: IClient[];
    age: number;
    steps: number;
    sleeps: number;
    status: string,
    stepsStatus: string,
    sleepsStatus: string,
    workoutUpdated: boolean;
    savingDone: boolean;
}

interface IActivityGuides {
    calories: number;
    steps: number;
}

interface ITotalDailyActivity {
    calories: number;
    steps: number;
}

interface IActivity {
    id: number,
    calories: number;
    steps: number;
    maxHr: number;
    activityDesc: string;
    duration: number;
    check: boolean;
}

interface IActivityDto {
    id: number,
    calories: number;
    steps: number;
    maxHr: number;
    duration: number;
    description: string;
    check: boolean;
    updated: string;
    created: string;
    clientId: number;
}

interface IClient {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
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
                .then(response => response.json() as Promise<IClient[]>)
                .then(data => this.setState({
                    clients: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get all activities
            fetch('api/tracker/' + this.props.logins[0].clientId + '/activity?date=' + date.toISOString())
                .then(response => response.json() as Promise<IActivityDto[]>)
                .then(data => this.setState({
                    activityDtos: data, apiUpdate: true
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
            updated: false,
            apiUpdate: false,
            savingStatus: 'Saved',
            dateChanged: false,
            clients: [],
            age: 0,
            sleeps: 0,
            steps: 0,
            status: "test",
            workoutUpdated: false,
            stepsStatus: '',
            sleepsStatus: '',
            savingDone: false
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
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Delete Completed' })).catch(error => console.log('delete meals---------->' + error));
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
        this.setActivities();
        this.setState({ activities: this.state.activities, updated: !this.state.updated });
    }

    onSave = () => {
        this.setState({ savingStatus: 'Saving in progress' })

        // delete rows
        this.deleteActivitiesByIds();

        // add rows
        setTimeout(() => {
            this.saveActivities();
        }, 2000);
    }

    getActivities = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/activity?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IActivityDto[]>)
            .then(data => this.setState({
                activityDtos: data, apiUpdate: true
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
            this.setState({ selectedDate: new Date(field['value']), activityDtos:[], dateChanged: true, apiUpdate: true })
        }
    }

    getColour = () => {
        if (this.state.savingStatus === 'Not Saved') {
            return 'red';
        }

        return 'green';
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

    setHeartRateStatus = () => {
        var maxHr: number = Math.max.apply(Math, this.state.activities.map(function (o) { return o.maxHr; }));
        if (this.state.activities.length < 1) {
            maxHr = 0;
        }

        if (maxHr > (220 - this.state.age)) {
            this.setState({ status: 'Warning!!!: Exceeding your max heart-rate is not advisable' });
        }
        else if (maxHr === (220 - this.state.age)) {
            this.setState({ status: 'Awesome!!!: Your body will keep burning for the next 24 Hours' });
        }
        else if (maxHr > (0.65 * (220 - this.state.age))) {
            this.setState({ status: 'Excellent: Your body will keep burning for the next 12 Hours' });
        }
        else if (maxHr > 0) {
            this.setState({ status: 'Great work so far' });
        }
        else {
            this.setState({ status: 'No max heartrate detected!!' });
        }
    }

    showProgressBar = () => {
        if (this.state.savingStatus == 'Saving in progress') {
            return (<Progress inverted color='green' percent={100} active={this.state.savingStatus === 'Saving in progress'}/>);
        }
    }

    render() {
        if (this.props.logins.length > 0) {
            if (this.state.savingDone === true) {
                this.setState({ savingDone: false });
                this.resetActivities();
                this.getActivities();
            }

            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false });
                this.resetActivities();
                this.getActivities();
            }

            if (this.state.apiUpdate === true) {
                this.setActivities();
                this.setState({ apiUpdate: false, updated: !this.state.updated});

                if (this.state.clients.length > 0) {
                    const client = this.state.clients[0];
                    this.setState({ age: client.age });
                }

                this.setHeartRateStatus();
            }

            if (this.state.workoutUpdated === true) {
                this.setHeartRateStatus();
                this.setState({ workoutUpdated: false });
            }

            var divStatusLabelStyle = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'black',
                backgroundColor: 'yellow'
            };

            var divLabelStyle = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fffafa',
                backgroundColor: this.getColour()
            };
        return (
            <div>
                <Grid centered>
                    <Grid.Row columns={2}>
                        <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                            <Label size='large' as='a' color='pink' basic circular>Daily Activities Tracker</Label>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' floated='right' textAlign='right'>
                            <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <div style={divLabelStyle}>
                                <a>{this.state.savingStatus}</a>
                            </div>
                            <Segment attached='bottom' textAlign='center'>
                                <ActivityHeader age={this.state.age} activities={this.state.activities} steps={this.state.steps} sleeps={this.state.sleeps} guides={this.state.guides} update={this.state.updated} />
                            </Segment>
                            <div style={divStatusLabelStyle}>
                                <a>{this.state.status}</a>
                            </div>
                            <Segment attached='bottom' textAlign='center'>
                                <Grid key={100} centered>
                                    <Grid.Row key={100} columns={3} stretched>
                                        <Grid.Column key={100} width={4} textAlign='left' verticalAlign='middle'>
                                            <div><a>Steps (Count)</a></div>
                                        </Grid.Column>
                                        <Grid.Column key={100 + 1} width={4} textAlign='left' verticalAlign='middle'>
                                            <Input as='a' size='mini' value={this.state.steps} placeholder='Steps Count' onChange={this.updateSteps} />
                                        </Grid.Column>
                                        <Grid.Column key={100 + 2} width={8} textAlign='left' verticalAlign='middle'>
                                            <div><a>{this.state.stepsStatus}</a></div>
                                        </Grid.Column>
                                        <Grid.Column key={100 + 3} width={4} textAlign='left' verticalAlign='middle'>
                                            <div><a>Sleep (Hours)</a></div>
                                        </Grid.Column>
                                        <Grid.Column key={100 + 4} width={4} textAlign='left' verticalAlign='middle'>
                                            <Input size='mini' value={this.state.sleeps} placeholder='Sleep Hours' onChange={this.updateSleeps} />
                                        </Grid.Column>
                                        <Grid.Column key={100 + 5} width={8} textAlign='left' verticalAlign='middle'>
                                            <div><a>{this.state.sleepsStatus}</a></div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment attached='top'>
                                <Grid centered>
                                    <Grid.Row columns={5}>
                                        <Grid.Column floated='left'>
                                            <Button size='tiny' color='red' fluid icon onClick={this.removeActivities}>
                                                <Icon name='minus' />
                                            </Button>
                                        </Grid.Column>
                                        <Grid.Column floated='right'>
                                            <Button size='tiny' color='blue' fluid icon onClick={this.addActivity}>
                                                <Icon name='plus' />
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
                    </Grid.Row>
                    <Grid.Row columns={3}>
                        <Grid.Column width={4} textAlign='left' floated='left'>
                            <Button floated='left' size='tiny' onClick={this.onCancel} secondary>Cancel</Button>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left' verticalAlign='bottom' floated='left'>
                            <Button floated='left' size='tiny' onClick={this.onSave} primary>Save</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {this.showProgressBar()}
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