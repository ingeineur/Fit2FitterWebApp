import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Form, Comment, Dropdown } from 'semantic-ui-react'

interface IProps {
    mealRef: number;
    measurementRef: number;
    activityRef: number;
    created: string;
    clientId: number;
    toClientId: number;
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
    updated: boolean;
    apiUpdate: boolean;
    clients: IClient[];
    clientDtos: IClientDto[];
    messageDtos: IMessageDto[];
    sentMessageDtos: IMessageDto[];
    messages: IMessage[];
    typedMessage: string;
    clientList: IOption[],
    toClientId: number;
    numChar: number;
    status: string;
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

interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
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

class MessagesChatStyle extends React.Component<IProps, IState> {
    public componentDidMount() {
        if (this.props.clientId === 2) {
            this.setState({ toClientId: this.props.toClientId });
        }
        
        if (this.props.clientId !== 0) {
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            this.getAllMessages();
        }
    }

    onSubmit = () => {
        this.setState({ username: '', password: '' });
    }

    setValuesFromDto = () => {
        if (this.state.clients.length > 0) {
            return;
        }

        this.state.clientDtos.forEach(client => {
            this.state.clients.push({ id: client.id, name: client.firstName, age: client.age, city: client.city });
        });

        this.setState({ clients: this.state.clients });
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: 'admin', password: 'password', activeItem: 'Received',
            updated: false,
            apiUpdate: false,
            clientDtos: [],
            clients: [],
            typedMessage: '',
            clientList: [],
            toClientId: 2,
            messageDtos: [],
            sentMessageDtos: [],
            messages: [],
            numChar: 0,
            status: 'Ready'
        };
    }

    updateMessage = (event: any) => {
        if (event.target.value.length > 255) {
            this.setState({ status: 'Reached Characters Limit (255)' });
            return;
        }

        this.setState({ typedMessage: event.target.value, status: 'Ready to send', numChar: event.target.value.length });
        if (event.target.value.length < 1) {
            this.setState({ status: 'Ready' });
        }
    }

    setMessages = () => {
        if (this.state.messageDtos.length > 0) {
            if (this.props.clientId === 2) {
                var arr = this.state.messageDtos.filter(x => x.fromId === parseInt(this.props.toClientId.toString()) ||
                    x.clientId === parseInt(this.props.toClientId.toString()));
                console.log(this.props.toClientId);
                console.log(arr);
                if (this.state.messages.length !== arr.length) {
                    arr.forEach(msg => {
                        this.state.messages.push({
                            id: msg.id, measurementRef: msg.measurementRef, mealsRef: msg.mealsRef,
                            activitiesRef: msg.activitiesRef, message: msg.message, fromId: msg.fromId,
                            clientId: msg.clientId, updated: msg.updated, created: msg.updated, readStatus: msg.readStatus
                        });
                    })

                    this.setState({ messages: this.state.messages });
                }
            }
            else {
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
            }
        }
    }

    getAllMessages = () => {
        if (this.props.measurementRef) {
            fetch('api/tracker/' + this.props.clientId + '/comments/measurements?dateString=' + this.props.created)
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    messageDtos: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
        else if (this.props.mealRef) {
            fetch('api/tracker/' + this.props.clientId + '/comments/measurements?dateString=' + this.props.created)
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    messageDtos: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
        else {
            fetch('api/tracker/' + this.props.clientId + '/all/comments?sent=' + false + '&mealsRef=0')
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    messageDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/tracker/' + this.props.clientId + '/all/comments?sent=' + true + '&mealsRef=0')
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    sentMessageDtos: data, apiUpdate: true
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
    }

    AddComment = (event: any, message: any) => {
        var fetchStr = 'api/tracker/comment?date=' + this.props.created;
        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0,
                measurementRef: this.props.measurementRef,
                mealsRef: this.props.mealRef,
                activitiesRef: this.props.activityRef,
                readStatus: false,
                message: this.state.typedMessage,
                updated: new Date(),
                created: this.props.created,
                fromId: this.props.clientId,
                clientId: parseInt(this.state.toClientId.toString()),
            })
        }).then(response => response.json()).then(data => this.setState({ updated: !this.state.updated, status:'Successfully Sent' })).catch(error => console.log('put macros ---------->' + error));

        // add rows
        setTimeout(() => {
            this.getAllMessages();
        }, 500);

        this.setState({ typedMessage: '' });
    }

    setToClient = (event: any, data: any) => {
        this.setState({ updated: true, toClientId: data['value'] });
    }

    getReplyOption = () => {
        if (this.props.clientId == 2) {
            return (<Form reply>
                <Form.TextArea value={this.state.typedMessage} onChange={this.updateMessage} />
                <div>
                    <a>{this.state.numChar} characters (max: 255)</a>
                </div>
                <div>
                    <Button content='Add Your Comment' labelPosition='left' icon='edit' primary onClick={this.AddComment} />
                    <a>{this.state.status}</a>
                </div>
            </Form>);
        }

        return (<Form reply>
            <Form.TextArea value={this.state.typedMessage} onChange={this.updateMessage} />
            <div>
                <a>{this.state.numChar} characters (max: 255)</a>
            </div>
            <div>
                <Button content='Drop Your Comment to Ida' labelPosition='left' icon='edit' primary onClick={this.AddComment} />
                <a>{this.state.status}</a>
            </div>
        </Form>);
    }

    getAvatar = (id: number) => {
        if (id === 2) {
            return 'ida_avatar.jpg';
        }

        return 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg'
    }

    getComments = () => {
        if (this.state.clients.length < 1) {
            return;
        }

        return (
            this.state.messages.map((item, index) =>
                <Comment key={index}>
                    <Comment.Avatar src={this.getAvatar(item.fromId)} />
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

    render() {
        if (this.state.apiUpdate === true) {
            this.resetMessages();
            this.setValuesFromDto();
            this.setMessages();
            this.setState({ apiUpdate: false });

            if (this.state.clientList.length < 1) {
                this.state.clientDtos.forEach(client => {
                    this.state.clientList.push({ key: client.id.toString(), text: client.firstName, value: client.id.toString() });
                });
            }
        }

        return (
            <div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Segment attached='bottom'>
                                <Comment.Group>
                                    {this.getComments()}
                                </Comment.Group>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='left'>
                        <Grid.Column textAlign='left' floated='left'>
                            {this.getReplyOption()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>);
    }
}

export default connect()(MessagesChatStyle);