import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Label, Form, Icon, Message, Modal, Dropdown } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import MacroGuideReviewModal from './MacroGuideReviewModal'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
    updated: boolean;
    apiUpdate: boolean;
    dateChanged: boolean;
    clients: IClient[];
    clientDtos: IClientDto[];
    mealsMessageDtos: IMessageDto[];
    mealsMessages: IMessage[];
    typedMessage: string;
    filterUnread: boolean;
    clientList: IOption[],
    toClientId: number;
    numChar: number;
    status: string;
    loggedMeals: ILoggedMeals[];
    macrosPlanDtos: IMacrosPlanDto[];
    guides: IMacroGuides;
    openReview: boolean;
    activeCreated: string;
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

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
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

interface ILoggedMeals {
    created: string;
    unreadComments: number;
    totalComments: number;
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

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class MessagesMeals extends React.Component<LoginProps, IState> {
    public componentDidMount() {
        this.props.getLogin();

        if (this.props.logins.length > 0) {
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments/meals')
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    mealsMessageDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get macros plan
            fetch('api/client/' + this.props.logins[0].clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlanDto[]>)
                .then(data => this.setState({
                    macrosPlanDtos: data, apiUpdate: true
                })).catch(error => console.log(error));
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

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '', password: '', activeItem: 'Received',
            updated: false,
            apiUpdate: false,
            dateChanged: false,
            clientDtos: [],
            clients: [],
            typedMessage: '',
            filterUnread: false,
            clientList: [],
            toClientId: 2,
            mealsMessageDtos: [],
            mealsMessages: [],
            numChar: 0,
            status: 'Ready',
            loggedMeals: [],
            macrosPlanDtos: [],
            guides: { carb: 0, protein: 0, fat: 0, fruits: 0 },
            openReview: false,
            activeCreated: ''
        };
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
            const client = this.state.clientDtos[this.state.clientDtos.findIndex(x => x.id === parseInt(this.props.logins[0].clientId.toString()))];
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

    groupBy = (list: IMessageDto[]) => {
        const map = new Map();
        list.forEach((item) => {
            const key = item.created;
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    setMessages = () => {
        if (this.state.mealsMessageDtos.length > 0) {
            if (this.state.mealsMessages.length !== this.state.mealsMessageDtos.length) {
                this.state.mealsMessageDtos.forEach(msg => {
                    this.state.mealsMessages.push({
                        id: msg.id, measurementRef: msg.measurementRef, mealsRef: msg.mealsRef,
                        activitiesRef: msg.activitiesRef, message: msg.message, fromId: msg.fromId,
                        clientId: msg.clientId, updated: msg.updated, created: msg.updated, readStatus: msg.readStatus
                    });
                })

                this.setState({ mealsMessages: this.state.mealsMessages });
            }
        }

        while (this.state.loggedMeals.length > 0) {
            this.state.loggedMeals.pop();
        }

        var test = this.groupBy(this.state.mealsMessageDtos);
        test.forEach((values: IMessageDto[], key: string) => {
            var unRead = values.filter(x => x.readStatus == false && x.clientId === this.props.logins[0].clientId);
            this.state.loggedMeals.push({ created: key, totalComments: values.length, unreadComments: unRead.length });
        });

        this.setState({ loggedMeals: this.state.loggedMeals });
    }

    getUnReadMessageColour = (total: number) => {
        if (total > 0) {
            return 'red';
        }

        return 'green';
    }

    onClickViewMeals = (event: any, message: any) => {
        this.updateMessageRead(this.props.logins[0].clientId, true, message['className']);
        this.setState({ activeCreated: message['className'] });
    }

    handleClose = () => {
        this.setState({ activeCreated: '' });
    }

    getDate = (dateString: string) => {
        var d: Date = new Date(dateString);
        d.setHours(24, 0, 0, 0);
        return d.toDateString();
    }

    getLoggedMeals = () => {
        this.state.loggedMeals.sort(function (a, b) { return (Date.parse(b.created) - Date.parse(a.created)); });

        return (
            this.state.loggedMeals.map((item, index) =>
                <div key={index}>
                    <Message key={index} color={this.getUnReadMessageColour(item.unreadComments)}>
                        <Label key={index} as='a' color={this.getUnReadMessageColour(item.unreadComments)} corner='right'>
                            <Icon key={index} name='food' />
                        </Label>
                        <Message.Header key={index + 1}>
                            <div style={divHeaderStyle}>
                                Logged Meals: {this.getDate(item.created)}
                            </div>
                            <Grid key={index} celled>
                                <Grid.Row key={index} columns={3} textAlign='center'>
                                    <Grid.Column key={index} textAlign='center'>
                                        <div>
                                            <a>New Msg:</a>
                                        </div>
                                        <div>
                                            <a>{item.unreadComments}</a>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column key={index + 1} textAlign='center'>
                                        <div>
                                            <a>Total Msg:</a>
                                        </div>            
                                        <div>
                                            <a>{item.totalComments}</a>
                                        </div>            
                                    </Grid.Column>
                                    <Grid.Column key={index + 2}>
                                        <div>
                                            <Modal
                                                className={item.created}
                                                key={index + 3}
                                                open={this.state.activeCreated === item.created}
                                                trigger={<Button size='tiny' className={item.created} onClick={this.onClickViewMeals} primary>Review Meals</Button>}>
                                                <Modal.Header key={index}>Meals Summary for {this.getDate(item.created)}</Modal.Header>
                                                <Modal.Content key={index + 1} scrolling>
                                                    <Modal.Description key={index}>
                                                        <MacroGuideReviewModal key={index} guides={this.state.guides} senderId={this.props.logins[0].clientId} clientId={this.props.logins[0].clientId} mealDate={item.created} update={this.state.updated} />
                                                    </Modal.Description>
                                                </Modal.Content>
                                                <Modal.Actions key={index + 2}>
                                                    <Button size='tiny' onClick={() => this.handleClose()} primary>
                                                        Close <Icon name='chevron right' />
                                                    </Button>
                                                </Modal.Actions>
                                            </Modal>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Message.Header>
                    </Message>
                    <div />
                </div>
            ));
    }

    getAllMessages = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments/meals')
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                mealsMessageDtos: data, apiUpdate: true
            })).catch(error => console.log(error));
    }

    resetMessages = () => {
        while (this.state.mealsMessages.length > 0) {
            this.state.mealsMessages.pop();
        }

        this.setState({
            mealsMessages: this.state.mealsMessages
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
                mealsRef: 1,
                activitiesRef: 0,
                readStatus: false,
                message: this.state.typedMessage,
                updated: new Date(),
                created: date.toISOString(),
                fromId: this.props.logins[0].clientId,
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
        this.setState({ dateChanged: true })
    }

    getReplyOption = () => {
        if (this.props.logins[0].clientId == 2) {
            return (<Form reply>
                <a>Select Recipient:</a><Dropdown id='toClient' value={this.state.toClientId} selection options={this.state.clientList} onChange={this.setToClient} />
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

    updateMessageRead = (clientId: number, read: boolean, date:string) => {
        var fetchStr = 'api/tracker/' + clientId + '/comment/meals/update?read=' + read + '&date=' + date;
        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(data => this.getAllMessages()).catch(error => console.log('put macros ---------->' + error));
    }

    render() {
        if (this.props.logins.length > 0) {
            if (this.state.apiUpdate === true) {
                this.resetMessages();
                this.setValuesFromDto();
                this.setMessages();
                this.setMacroGuides();
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
                    <Grid.Row columns={2}>
                        <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                            <Label size='large' as='a' color='pink' basic circular>Meals Log</Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Segment attached='bottom'>
                                {this.getLoggedMeals()}
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
)(MessagesMeals as any);