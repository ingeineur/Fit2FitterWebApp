import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Menu, Comment, Grid, Header, Label, Form, Icon, Image, List, Flag, Container, Message, Checkbox, Dropdown } from 'semantic-ui-react'
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
    sentMessageDtos: IMessageDto[];
    sentMessages: IMessage[];
    typedMessage: string;
    filterUnread: boolean;
    clientList: IOption[],
    toClientId: number;
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
    color: 'grey'
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

class Messages extends React.Component<LoginProps, IState> {
    public componentDidMount() {
        this.props.getLogin();
        
        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments?sent=' + false)
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    messageDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments?sent=' + true)
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    sentMessageDtos: data, apiUpdate: true
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
            username: '', password: '', activeItem: 'Received',
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
            typedMessage: '',
            filterUnread: false,
            clientList: [],
            toClientId: 2,
            sentMessageDtos: [],
            sentMessages: [] 
        };
    }

    updateMessage = (event: any) => {
        this.setState({ typedMessage: event.target.value });
    }

    setMessages = () => {
        if (this.state.messageDtos.length > 0) {

            if (this.state.messages.length !== this.state.messageDtos.length) {
                this.state.messageDtos.forEach(msg => {
                    this.state.messages.push({
                        id: msg.id, measurementRef: msg.measurementRef, mealsRef: msg.mealsRef,
                        activitiesRef: msg.activitiesRef, message: msg.message, fromId: msg.fromId,
                        clientId: msg.clientId, updated: msg.updated, created: msg.updated, readStatus: msg.readStatus
                    });
                })

                this.setState({ messages: this.state.messages });
            }

            if (this.state.sentMessages.length !== this.state.sentMessageDtos.length) {
                this.state.sentMessageDtos.forEach(msg => {
                    this.state.sentMessages.push({
                        id: msg.id, measurementRef: msg.measurementRef, mealsRef: msg.mealsRef,
                        activitiesRef: msg.activitiesRef, message: msg.message, fromId: msg.fromId,
                        clientId: msg.clientId, updated: msg.updated, created: msg.updated, readStatus: msg.readStatus
                    });
                })

                this.setState({ sentMessages: this.state.sentMessages });
            }
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

    updateMessageRead = (id:number, read: boolean) => {
        var fetchStr = 'api/tracker/' + id + '/comment/update?read=' + read;
        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(data => this.getMessages2()).catch(error => console.log('put macros ---------->' + error));
    }

    handleCheckChange = (field: any, value: any) => {
        console.log(value['checked']);
        this.state.messages[parseInt(value['className'])].readStatus = value['checked'];
        this.setState({ messages: this.state.messages, updated: true });
        this.updateMessageRead(this.state.messages[parseInt(value['className'])].id, value['checked']);
    }

    getMessagesNew = () => {
        if (this.state.clients.length < 1) {
            return;
        }

        return (
            this.state.messages.map((item, index) =>
                <div key={index}>
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
                            <div key={index} style={divLabelStyle}>
                                Message: {item.message}
                            </div>
                            <div key={index + 1} style={divMessageStyle}>
                                <Checkbox className={index.toString()} key={index} checked={item.readStatus} onChange={this.handleCheckChange} />
                                <a key={index + 1}> Read </a>
                            </div>
                        </Message.Content>
                    </Message>
                    <div/>
                </div>
            ));
    }

    getSentMessagesNew = () => {
        if (this.state.clients.length < 1) {
            return;
        }

        //var filtered: IMessage[] = [];
        //this.state.sentMessages.forEach(msg => {
        //    if (this.state.filterUnread && msg.readStatus === false) {
        //        filtered.push(msg);
        //    }
        //    else if (this.state.filterUnread === false) {
        //        filtered.push(msg);
        //    }
        //});

        return (
            this.state.sentMessages.map((item, index) =>
                <div key={index}>
                    <Message key={index} color='grey'>
                        <Message.Header key={index}>
                            <div style={divHeaderStyle}>
                                Received: {new Date(item.created).toLocaleDateString()}
                            </div>
                            <div style={divHeaderStyle}>
                                To: {this.state.clients[this.state.clients.findIndex(x => x.id === item.clientId)].name}
                            </div>
                        </Message.Header>
                        <Message.Content key={index + 1}>
                            <div key={index} style={divLabelStyle}>
                                Message: {item.message}
                            </div>
                            <div key={index + 1} style={divMessageStyle}>
                                <Checkbox className={index.toString()} key={index} checked={item.readStatus} />
                                <a key={index + 1}> Read Status </a>
                            </div>
                        </Message.Content>
                    </Message>
                    <div />
                </div>
            ));
    }

    getMessageRows = () => {
        if (this.state.activeItem === 'Sent') {
            return this.getSentMessagesNew();
        }

        return this.getMessagesNew();
    }

    getMessages = (readStatus: boolean) => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments?readStatus=' + readStatus)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageDtos: data, apiUpdate: true
            })).catch(error => console.log(error));
    }

    getMessages2 = () => {
        if (this.state.filterUnread) {
            return this.getMessages(false);
        }
        this.getAllMessages(false);
    }

    getAllMessages = (sent: boolean) => {
        if (sent) {
            fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments?sent=' + sent)
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    sentMessageDtos: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
        else {
            fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments?sent=' + sent)
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    messageDtos: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
    }

    resetMessages = () => {
        while (this.state.messages.length > 0) {
            this.state.messages.pop();
        }

        this.setState({
            messages: this.state.messages
        });

        while (this.state.sentMessages.length > 0) {
            this.state.sentMessages.pop();
        }

        this.setState({
            sentMessages: this.state.sentMessages
        });
    }

    AddComment = (event: any, message: any) => {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        var fetchStr = 'api/tracker/comment?date=' + date.toISOString();
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
                created: date.toISOString(),
                fromId: this.props.logins[0].clientId,
                clientId: parseInt(this.state.toClientId.toString()),
            })
        }).then(response => response.json()).then(data => this.setState({ updated: !this.state.updated})).catch(error => console.log('put macros ---------->' + error));

        // add rows
        setTimeout(() => {
            this.getAllMessages(true);
        }, 500);

        this.setState({ typedMessage: '' });
    }

    showOnlyUnread = (field: any, value: any) => {
        this.setState({ filterUnread: value['checked'] });
        if (value['checked'] === true) {
            this.getMessages(false);
            this.getAllMessages(true);
        }
        else {
            this.getAllMessages(false);
            this.getAllMessages(true);
        }
    }

    setToClient = (event: any, data: any) => {
        console.log(data);
        this.setState({ updated: true, toClientId: data['value'] });
        this.setState({ dateChanged: true })
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    render() {
        if (this.props.logins.length > 0) {
            if (this.state.apiUpdate === true) {
                this.resetMessages();
                this.setValuesFromDto();
                this.setMessages();
                this.setState({ messages: this.state.messages, apiUpdate: false });

                if (this.state.clientList.length < 1) {
                    this.state.clientDtos.forEach(client => {
                        this.state.clientList.push({ key: client.id.toString(), text: client.firstName, value: client.id.toString() });
                    });
                }
            }
        return (
            <div>
                <Grid centered>
                    <Grid.Row columns={2}>
                        <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                            <Label size='large' as='a' color='pink' basic circular>Messages</Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Form reply>
                                <a>Select Recipient:</a><Dropdown id='toClient' value={this.state.toClientId} selection options={this.state.clientList} onChange={this.setToClient} />
                                <Form.TextArea value={this.state.typedMessage} onChange={this.updateMessage} />
                                <Button content='Add Your Comment' labelPosition='left' icon='edit' primary onClick={this.AddComment} />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Checkbox checked={this.state.filterUnread} onChange={this.showOnlyUnread} />
                            <a> Show Unread Messages Only </a>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Menu attached='top' tabular compact>
                                <Menu.Item
                                    name='Received'
                                    active={this.state.activeItem === 'Received'}
                                    onClick={this.handleItemClick}
                                />
                                <Menu.Item
                                    name='Sent'
                                    active={this.state.activeItem === 'Sent'}
                                    onClick={this.handleItemClick}
                                />
                            </Menu>

                            <Segment attached='bottom'>
                                {this.getMessageRows()}
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
)(Messages as any);