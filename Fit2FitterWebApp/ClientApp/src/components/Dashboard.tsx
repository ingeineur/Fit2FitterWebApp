import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Header, Label, Input, Icon, Image, List, Flag } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
    selectedDate: Date;
    prevDate: Date;
    guides: IActivityGuides;
    totalActivities: ITotalDailyActivity;
    activities: IActivity[];
    updated: boolean;
    apiUpdate: boolean;
    activityDtos: IActivityDto[];
    dateChanged: boolean;
    clients: IClient[];
    clientDtos: IClientDto[];
    group: string;
}

interface IClient {
    id: number
    name: string;
    age: number;
    city: string;
    grp: string;
    img: string;
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
    name: string,
    img: string,
    calories: number;
    steps: number;
    ActivityDesc: string;
}

interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    grp: string;
    created: string;
    avatar: string;
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

class Dashboard extends React.Component<LoginProps, IState> {
    public componentDidMount() {
        this.props.getLogin();
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        this.setState({ selectedDate: date, prevDate: date });

        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get all activities
            fetch('api/tracker/activity?date=' + date.toISOString())
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
        console.log(event.target.value);
    }

    updateInput2 = (event: any) => {
        this.setState({ password: event.target.value });
        console.log(event.target.value);
    }

    addActivity = (event: any) => {
        this.state.activities.push({ name: '', img: '', ActivityDesc: 'test', steps: 1, calories: 100 });
        this.setState({ updated: !this.state.updated });
        console.log(this.state.activities);
    }

    setValuesFromDto = () => {
        if (this.state.clients.length > 0) {
            return;
        }

        this.state.clientDtos.forEach(client => {
            this.state.clients.push({ id: client.id, img: client.avatar, name: client.firstName, age: client.age, city: client.city, grp: client.grp });
        });


        var client = this.state.clientDtos[this.state.clientDtos.findIndex(x => x.id === this.props.logins[0].clientId)]
        if (client !== undefined) {
            this.setState({ group: client.grp })
            this.setState({ clients: this.state.clients });
        }
    }

    constructor(props: LoginProps) {
        super(props);
        //this.updateParentCarb = this.updateParentCarb.bind(this);
        this.state = {
            username: '', password: '', activeItem: 'Breakfast',
            selectedDate: new Date(),
            prevDate: new Date(),
            guides: { calories: 150, steps: 10000 },
            totalActivities: { calories: 0, steps: 0 },
            activities: [],
            updated: false,
            apiUpdate: false,
            activityDtos: [],
            dateChanged: false,
            clientDtos: [],
            clients: [],
            group: ''
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    getFlag = (country: string) => {
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

    getPhoto = (img: string) => {
        if (img != '') {
            return '/images/avatars/' + img;
        }

        return 'https://react.semantic-ui.com/images/avatar/small/rachel.png';
    }

    getRows = (type: string) => {
        var sorted = this.state.activities.sort((a, b) => (a.steps > b.steps ? -1 : 1));
        if (type === 'TCB') {
            sorted = this.state.activities.sort((a, b) => (a.calories > b.calories ? -1 : 1));
        }
        return (
            sorted.map((item, index) =>
                <List.Item key={index}>
                    <Image key={index} avatar src={this.getPhoto(item.img)} />
                    <List.Content key={index + 1}>
                        <List.Header key={index} as='a'>{item.name} {this.getFlag(item.ActivityDesc)}</List.Header>
                        <List.Description key={index + 1}>
                            Steps: {item.steps} Calories: {item.calories}
                        </List.Description>
                    </List.Content>
                </List.Item>
            ));
    }

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        //console.log('1 --' + Math.abs((this.state.selectedDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24)));
        //console.log('2 --' + Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24)));
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), activityDtos: [], dateChanged: true, apiUpdate: true })
        }
    }

    setActivities = () => {
        if (this.state.activityDtos.length > 0 && this.state.clients.length > 0) {

            if (this.state.activities.length > 0) {
                return;
            }

            this.state.activityDtos.forEach(activity => {
                var clientActivity = this.state.clients[this.state.clients.findIndex(x => x.id === activity.clientId)];
                if (clientActivity !== null && this.state.group === clientActivity.grp) {
                    this.state.activities.push({ name: clientActivity.name, img: clientActivity.img, ActivityDesc: clientActivity.city, calories: activity.calories, steps: activity.steps });
                }
            })
        }
    }

    getActivities = () => {
        fetch('api/tracker/activity?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IActivityDto[]>)
            .then(data => {
                this.setState({
                    activityDtos: data, apiUpdate: true
                });
                //this.intervalID = setTimeout(this.getActivities.bind(this), 10000);
            }).catch(error => console.log(error));
    }

    resetActivities = () => {
        while (this.state.activities.length > 0) {
            this.state.activities.pop();
        }

        this.setState({
            activities: this.state.activities
        });
    }

    render() {
        if (this.props.logins.length > 0) {
            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false });
                this.resetActivities();
                this.getActivities();
            }

            if (this.state.apiUpdate === true) {
                this.setValuesFromDto();
                this.setActivities();
                this.setState({ activities: this.state.activities, apiUpdate: false, updated: !this.state.updated });
            }
        return (
            <div>
                <Grid centered>
                    <Grid.Row columns={2}>
                        <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                            <Label size='large' as='a' color='pink' basic circular>Daily Leaderboards</Label>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' floated='right' textAlign='right'>
                            <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Segment inverted attached='top'>
                                <h5>Steps Leaderboard</h5>
                            </Segment>
                            <Segment attached='bottom'>
                                <List>
                                    {this.getRows('TS')}
                                </List>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment inverted attached='top'>
                                <h5>TCB Leaderboard</h5>
                            </Segment>
                            <Segment attached='bottom'>
                                <List>
                                    {this.getRows('TCB')}
                                </List>
                            </Segment>
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
)(Dashboard as any);