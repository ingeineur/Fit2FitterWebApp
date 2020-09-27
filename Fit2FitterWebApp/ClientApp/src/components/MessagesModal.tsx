import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Comment, Grid, Header, Label, Form, Icon, Image, List, Flag, Container, Message, Checkbox } from 'semantic-ui-react'
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
    messageDtos: IMessageDto[];
    messages: IMessage[];
    typedMessage: string
}

interface IClient {
    id: number
    name: string;
    age: number;
    city: string;
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
    created: string;
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

interface IMessage {
    id: number,
    measurementRef: string;
    mealsRef: string;
    activitiesRef: string;
    message: string;
    readStatus: boolean;
    updated: string;
    created: string;
    fromId: number;
    clientId: number;
}

interface IMessageDto {
    id: number,
    measurementRef: string;
    mealsRef: string;
    activitiesRef: string;
    message: string;
    readStatus: boolean;
    updated: string;
    created: string;
    fromId: number;
    clientId: number;
}

const divHeaderStyle = {
    color: '#FE019A'
};

const divLabelStyle = {
    color: 'black'
};

const divMessageStyle = {
    color: 'blue',
    verticalAlign:'middle'
};

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class MessagesModal extends React.Component<LoginProps, IState> {
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

            fetch('api/tracker/' + this.props.logins[0].clientId + '/comments?date=' + date.toISOString())
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    messageDtos: data, apiUpdate: true
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
        this.state.activities.push({ name: '', ActivityDesc: 'test', steps: 1, calories: 100 });
        this.setState({ updated: !this.state.updated });
        console.log(this.state.activities);
    }

    setValuesFromDto = () => {
        if (this.state.clients.length > 0) {
            return;
        }

        this.state.clientDtos.forEach(client => {
            this.state.clients.push({ id: client.id, name: client.firstName, age: client.age, city: client.city });
        });

        this.setState({ clients: this.state.clients});
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
            messageDtos: [],
            messages: [],
            typedMessage: ''
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    updateMessage = (event: any) => {
        this.setState({ typedMessage: event.target.value });
    }

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), activityDtos: [], dateChanged: true, apiUpdate: true })
        }
    }

    setActivities = () => {
        if (this.state.activityDtos.length > 0 && this.state.clients.length > 0) {

            if (this.state.activities.length === this.state.activityDtos.length) {
                return;
            }

            this.state.activityDtos.forEach(activity => {
                this.state.activities.push({ name: this.state.clients[this.state.clients.findIndex(x => x.id === activity.clientId)].name, ActivityDesc: this.state.clients[this.state.clients.findIndex(x => x.id === activity.clientId)].city, calories: activity.calories, steps: activity.steps });
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

    setMessages = () => {
        if (this.state.messageDtos.length > 0) {

            if (this.state.messages.length === this.state.messageDtos.length) {
                return;
            }

            this.state.messageDtos.forEach(msg => {
                this.state.messages.push({
                    id: msg.id, measurementRef: msg.measurementRef, mealsRef: msg.mealsRef,
                    activitiesRef: msg.activitiesRef, message: msg.message, fromId: msg.fromId,
                    clientId: msg.clientId, updated: msg.updated, created: msg.updated, readStatus: msg.readStatus
                });
            })

            this.setState({ messages: this.state.messages });
        }
    }

    getComments = () => {
        if (this.state.clients.length < 1) {
            return;
        }

        return (
            this.state.messages.map((item, index) =>
                <Comment key={index}>
                    <Comment.Content key={index}>
                        <Comment.Author key={index}>{this.state.clients[this.state.clients.findIndex(x => x.id === item.fromId)].name}</Comment.Author>
                        <Comment.Metadata>
                            <div>{new Date(item.updated).toLocaleDateString()}</div>
                        </Comment.Metadata>
                        <Comment.Text key={index + 1}>{item.message}</Comment.Text>
                    </Comment.Content>
                </Comment>
            ));
    }

    getCommentStyle = () => {
        return (<Comment.Group>
            {this.getComments()}
        </Comment.Group>);
    }

    getMessagesNew = () => {
        if (this.state.clients.length < 1) {
            return;
        }

        return (
            this.state.messages.map((item, index) =>
                <div>
                    <Message key={index} color='grey'>
                        <Message.Header key={index}>
                            <div style={divHeaderStyle}>
                                Received: {new Date(item.created).toLocaleDateString()}
                            </div>
                            <div style={divHeaderStyle}>
                                From: {this.state.clients[this.state.clients.findIndex(x => x.id === item.fromId)].name}
                            </div>
                        </Message.Header>
                        <Message.Content key={index + 1}>
                            <div style={divLabelStyle}>
                                Message: {item.message}
                            </div>
                            <div style={divMessageStyle}>
                                <Checkbox as='a' key={index} checked={item.readStatus} />
                                <a> Read </a>
                            </div>
                        </Message.Content>
                    </Message>
                    <div/>
                </div>
            ));
    }

    getMessages = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/comments?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageDtos: data, apiUpdate: true
            })).catch(error => console.log(error));
    }

    resetMessages = () => {
        while (this.state.messages.length > 0) {
            this.state.messages.pop();
        }

        this.setState({
            messages: this.state.messages
        });
    }

    AddComment = (event: any, message: any) => {
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
                mealsRef: 0,
                activitiesRef: 0,
                readStatus: false,
                message: this.state.typedMessage,
                updated: new Date(),
                created: this.state.selectedDate.toISOString(),
                fromId: this.props.logins[0].clientId,
                clientId: this.props.logins[0].clientId,
            })
        }).then(response => response.json()).then(data => this.setState({ updated: !this.state.updated})).catch(error => console.log('put macros ---------->' + error));

        // add rows
        setTimeout(() => {
            this.getMessages();
        }, 500);

        this.setState({ typedMessage: '' });
    }

    render() {
        if (this.props.logins.length > 0) {
            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false });
                this.resetMessages();
                this.getMessages();
            }

            if (this.state.apiUpdate === true) {
                this.resetMessages();
                this.setValuesFromDto();
                this.setMessages();
                this.setState({ messages: this.state.messages, apiUpdate: false });
            }
        return (
            <div>
                <Grid centered>
                    <Grid.Row columns={2}>
                        <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                            <Label size='large' as='a' color='pink' basic circular>Messages</Label>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' floated='right' textAlign='right'>
                            <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Form reply>
                                <Form.TextArea value={this.state.typedMessage} onChange={this.updateMessage} />
                                <Button content='Add Your Comment' labelPosition='left' icon='edit' primary onClick={this.AddComment} />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.getMessagesNew()}
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
)(MessagesModal as any);