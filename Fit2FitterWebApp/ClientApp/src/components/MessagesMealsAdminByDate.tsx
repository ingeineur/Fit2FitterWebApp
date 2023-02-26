import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Label, Form, Icon, Message, Modal, Loader, Dimmer, Divider } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import MacroGuideReviewModal from './MacroGuideReviewModal'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import AppsMenu from './AppMenus';

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
    mealsMessageAdminDtos: IMessageDto[];
    mealsMessageDtos: IMessageDto[];
    mealsMessages: IMessage[];
    typedMessage: string;
    filterUnread: boolean;
    clientList: IOption[],
    toClientId: number;
    numChar: number;
    status: string;
    loggedMeals: INotification[];
    macrosPlanDtos: IMacrosPlanDto[];
    guides: IMacroGuides;
    openReview: boolean;
    activeCreated: string;
    selectedDate: Date;
    prevDate: Date;
    notifications: INotification[];
    messagesMealsDownloaded: boolean;
    messagesMealsAdminDownloaded: boolean;
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
    avatar: string;
    grp: string;
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

interface INotification {
    clientId: number;
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

class MessagesMealsAdminByDate extends React.Component<LoginProps, IState> {
    public componentDidMount() {
        this.props.getLogin();
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        this.setState({ selectedDate: date, prevDate: date });

        if (this.props.logins.length > 0) {
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/tracker/all/comments/meals?dateString=' + date.toISOString())
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    mealsMessageDtos: data, apiUpdate: true, messagesMealsDownloaded: true
                })).catch(error => console.log(error));

            //get macros plan
            fetch('api/client/' + this.state.toClientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlanDto[]>)
                .then(data => this.setState({
                    macrosPlanDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get notifications for admin
            fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments/meals')
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    mealsMessageAdminDtos: data, apiUpdate: true, messagesMealsAdminDownloaded: true
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
            toClientId: 3,
            mealsMessageDtos: [],
            mealsMessages: [],
            numChar: 0,
            status: 'Ready',
            loggedMeals: [],
            macrosPlanDtos: [],
            guides: { carb: 0, protein: 0, fat: 0, fruits: 0 },
            openReview: false,
            activeCreated: '',
            selectedDate: new Date(),
            prevDate: new Date(),
            mealsMessageAdminDtos: [],
            notifications: [],
            messagesMealsAdminDownloaded: false,
            messagesMealsDownloaded: false
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
            const client = this.state.clientDtos[this.state.clientDtos.findIndex(x => x.id === parseInt(this.state.toClientId.toString()))];
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

    groupByFromId = (list: IMessageDto[]) => {
        const map = new Map();
        list.forEach((item) => {
            const key = item.fromId;
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    setAdminNotifications = () => {
        if (this.state.mealsMessageAdminDtos.length > 0) {
            while (this.state.notifications.length > 0) {
                this.state.notifications.pop();
            }

            var test = this.groupByFromId(this.state.mealsMessageAdminDtos);
            test.forEach((values: IMessageDto[], key: number) => {
                var unRead = values.filter(x => x.readStatus == false && x.clientId === this.props.logins[0].clientId);
                this.state.notifications.push({ clientId: key, totalComments: values.length, unreadComments: unRead.length });
            });

            this.setState({ notifications: this.state.notifications });
        }
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

        var test = this.groupByFromId(this.state.mealsMessageDtos);
        test.forEach((values: IMessageDto[], key: number) => {
            var unRead = values.filter(x => x.readStatus == false && x.clientId === this.props.logins[0].clientId);
            this.state.loggedMeals.push({ clientId: key, totalComments: values.length, unreadComments: unRead.length });
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
        this.setState({ dateChanged: true })
    }

    getNotifications = () => {
        if (this.state.clientDtos.length < 1) {
            return;
        }

        var arr = this.state.notifications.filter(x => x.unreadComments > 0);

        return (
            arr.map((item, index) =>
                <div key={index}>
                    <Message key={index} color={this.getUnReadMessageColour(item.unreadComments)}>
                        <Label key={index} as='a' color={this.getUnReadMessageColour(item.unreadComments)} corner='right'>
                            <Icon key={index} name='user' />
                        </Label>
                        <Message.Header key={index + 1}>
                            <div style={divHeaderStyle}>
                                {this.state.clientDtos[this.state.clientDtos.findIndex(x => x.id === parseInt(item.clientId.toString()))].firstName}
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
                                </Grid.Row>
                            </Grid>
                        </Message.Header>
                    </Message>
                    <div />
                </div>
            ));
    }

    getDate = (dateString: string) => {
        var d: Date = new Date(dateString);
        d.setHours(24, 0, 0, 0);
        return d.toDateString();
    }

    getLoggedMeals = (unread: boolean) => {
        if (this.state.clientDtos.length < 1) {
            return;
        }

        var meals = this.state.loggedMeals.filter(x => x.unreadComments < 1);
        if (unread) {
            meals = this.state.loggedMeals.filter(x => x.unreadComments > 0)
        }

        return (
            meals.map((item, index) =>
                <div key={index}>
                    <Message key={index} color={this.getUnReadMessageColour(item.unreadComments)}>
                        <Label key={index} as='a' color={this.getUnReadMessageColour(item.unreadComments)} corner='right'>
                            <Icon key={index} name='user' />
                        </Label>
                        <Message.Header key={index + 1}>
                            <div style={divHeaderStyle}>
                                {this.state.clientDtos[this.state.clientDtos.findIndex(x => x.id === parseInt(item.clientId.toString()))].firstName}
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
                                                className={item.clientId.toString()}
                                                key={index + 3}
                                                open={this.state.activeCreated === item.clientId.toString()}
                                                trigger={<Button size='tiny' className={item.clientId.toString()} onClick={this.onClickViewMeals} primary>Review Meals</Button>}>
                                                <Modal.Header key={index}>Meals Summary for {this.state.selectedDate.toLocaleDateString()}</Modal.Header>
                                                <Modal.Content key={index + 1} scrolling>
                                                    <Modal.Description key={index}>
                                                        <MacroGuideReviewModal key={index} senderId={2} clientId={item.clientId} mealDate={this.state.selectedDate.toISOString()} update={this.state.updated} />
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
        this.setState({ messagesMealsDownloaded: false });
        fetch('api/tracker/all/comments/meals?dateString=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                mealsMessageDtos: data, apiUpdate: true, messagesMealsDownloaded: true
            })).catch(error => console.log(error));
    }

    getAllMessagesAdmin = () => {
        this.setState({ messagesMealsAdminDownloaded: false });
        fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments/meals')
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                mealsMessageAdminDtos: data, apiUpdate: true, messagesMealsAdminDownloaded: true
            })).catch(error => console.log(error));
    }

    getMacrosPlan = () => {
        fetch('api/client/' + this.state.toClientId + '/macrosplan')
            .then(response => response.json() as Promise<IMacrosPlanDto[]>)
            .then(data => this.setState({
                macrosPlanDtos: data, apiUpdate: true
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

    setToClient = (event: any, data: any) => {
        this.setState({ updated: true, toClientId: data['value'] });
        this.setState({ dateChanged: true })
    }

    updateMessageRead = (clientId: number, read: boolean, toClientId: string) => {
        var fetchStr = 'api/tracker/' + clientId + '/' + parseInt(toClientId) + '/comment/meals/update?read=' + read + '&date=' + this.state.selectedDate.toISOString();
        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(data => this.getAllMessages()).then(data => this.getAllMessagesAdmin()).catch(error => console.log('put macros ---------->' + error));
    }

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        newDate.setHours(0, 0, 0, 0);
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: newDate, dateChanged: true, apiUpdate: true })
        }
    }

    isLoadingData = () => {
        if (this.state.clientDtos.length < 1 ||
            this.state.macrosPlanDtos.length < 1 ||
            this.state.messagesMealsAdminDownloaded === false ||
            this.state.messagesMealsDownloaded === false) {
            return true;
        }

        return false;
    }

    render() {
        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.props.logins.length > 0) {
            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false });
                this.resetMessages();
                //get macro guides
                this.getMacrosPlan();
                //get messages
                this.getAllMessages();
                this.getAllMessagesAdmin();
            }

            if (this.state.apiUpdate === true) {
                this.resetMessages();
                this.setValuesFromDto();
                this.setMessages();
                this.setAdminNotifications();
                this.setMacroGuides();
                this.setState({ apiUpdate: false });

                if (this.state.clientList.length < 1) {
                    this.state.clientDtos.forEach(client => {
                        this.state.clientList.push({ key: client.id.toString(), text: client.firstName, value: client.id.toString() });
                    });
                }
            }
            if (this.isLoadingData()) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                </div>);
            }    
        return (
            <div>
                <Grid centered>
                    <Grid.Row textAlign='left'>
                        <Grid.Column width={16}>
                            <AppsMenu activeParentItem='MessagesMain' activeItem='Meals Logger by Date (Admin)' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                            <Divider />
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' width={16} textAlign='left' floated='left'>
                            <div>
                                <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Segment attached='bottom'>
                                <a>[Not Reviewed: {(this.state.loggedMeals.filter(x => x.unreadComments !== 0)).length}]  [Reviewed: {(this.state.loggedMeals.filter(x => x.unreadComments === 0)).length}]</a>
                                {this.getLoggedMeals(true)}
                                {this.getLoggedMeals(false)}
                            </Segment>
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
)(MessagesMealsAdminByDate as any);