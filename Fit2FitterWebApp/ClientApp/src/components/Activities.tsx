import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Menu, Label, Input, Icon } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import ActivityTable from './ActivityTable'
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
    activityDtos: IActivityDto[];
    updated: boolean;
    apiUpdate: boolean;
    savingStatus: string;
    dateChanged: boolean;
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
    calories: number;
    steps: number;
    ActivityDesc: string;
    check: boolean;
}

interface IActivityDto {
    id: number,
    calories: number;
    steps: number;
    description: string;
    check: boolean;
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

class Activities extends React.Component<LoginProps, IState> {

    public componentDidMount() {
        this.props.getLogin();
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        this.setState({ selectedDate: date, prevDate: date });
        
        if (this.props.logins.length > 0) {

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
        this.state.activities.push({ ActivityDesc: '', steps: 0, calories: 0, check: false });
        this.setState({ updated: !this.state.updated });
    }

    removeActivities = (event: any) => {
        var arr = this.state.activities.filter(obj => obj.check === false);
        this.setState({ updated: !this.state.updated, activities: arr });
    }

    updateActivities = (input:IActivity[]) => {
        this.setState({
            activities: input
        });
        this.setState({ updated: !this.state.updated, savingStatus: 'Not Saved' });
    }

    constructor(props: LoginProps) {
        super(props);
        this.updateActivities = this.updateActivities.bind(this);
        this.state = {
            username: '', password: '',
            selectedDate: new Date(),
            prevDate: new Date(),
            guides: { calories: 150, steps: 10000 },
            totalActivities: { calories: 0, steps: 0 },
            activities: [],
            activityDtos: [],
            updated: false,
            apiUpdate: false,
            savingStatus: 'Saved',
            dateChanged: false
        };
    }

    setActivities = () => {
        if (this.state.activityDtos.length > 0) {

            if (this.state.activities.length === this.state.activityDtos.length) {
                return;
            }

            this.state.activityDtos.forEach(activity => {
                this.state.activities.push({ ActivityDesc: activity.description, calories: activity.calories, steps: activity.steps, check: false });
            })
        }
    }

    deleteActivities = () => {
        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/tracker/' + this.props.logins[0].clientId + '/activity/delete?date=' + this.state.selectedDate.toISOString();
        fetch(fetchStr, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saving in progress' })).catch(error => console.log('delete meals---------->' + error));
    }

    saveActivities = () => {
        if (this.state.activities.length < 1) {
            this.setState({ savingStatus: 'Saved' })
            return;
        }

        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/tracker/activity?date=' + this.state.selectedDate.toISOString();

        this.state.activities.forEach(activity => {
            fetch(fetchStr, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: 0,
                    Calories: activity.calories,
                    Steps: activity.steps,
                    Description: activity.ActivityDesc,
                    Updated: new Date(),
                    Created: this.state.selectedDate.toISOString(),
                    ClientId: this.props.logins[0].clientId,
                })
            }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));
        });
    }

    onCancel = () => {
        this.resetActivities();
        this.setActivities();
        this.setState({ activities: this.state.activities, updated: !this.state.updated });
    }

    onSave = () => {
        // delete rows
        this.deleteActivities();

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
        //console.log('1 --' + Math.abs((this.state.selectedDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24)));
        //console.log('2 --' + Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24)));
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

    render() {
        if (this.props.logins.length > 0) {
            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false });
                this.resetActivities();
                this.getActivities();
            }

            if (this.state.apiUpdate === true) {
                this.setActivities();
                this.setState({ activities: this.state.activities, apiUpdate: false, updated: !this.state.updated });
            }

            var divLabelStyle = {
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
                            <Segment textAlign='center'>
                                <ActivityHeader activities={this.state.activities} guides={this.state.guides} update={this.state.updated} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment attached='top'>
                                <Grid centered>
                                    <Grid.Row columns={4}>
                                        <Grid.Column floated='left'>
                                            <Button size='tiny' color='black' fluid icon onClick={this.removeActivities}>
                                                <Icon name='minus' />
                                            </Button>
                                        </Grid.Column>
                                        <Grid.Column>
                                        </Grid.Column>
                                        <Grid.Column>
                                        </Grid.Column>
                                        <Grid.Column floated='right'>
                                            <Button size='tiny' color='black' fluid icon onClick={this.addActivity}>
                                                <Icon name='plus' />
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Segment textAlign='center' attached='bottom'>
                                <ActivityTable updateActivities={this.updateActivities} activities={this.state.activities} guides={this.state.guides} update={this.state.updated} />
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
                        <Grid.Column verticalAlign='middle' width={8} textAlign='left' floated='left'>
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
)(Activities as any);