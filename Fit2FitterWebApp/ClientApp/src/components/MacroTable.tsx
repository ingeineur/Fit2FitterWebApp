import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Label, Icon, Segment, Checkbox } from 'semantic-ui-react'

interface IProps {
    meals: IMealDetails[] 
    update: boolean;
    macroType: string;
    mealType: number;
    updateMeals: Function
}

interface IMealDetails {
    macro: number;
    mealDesc: string;
    check: boolean;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
    macroType: string;
    mealType: number;
    meals: IMealDetails[];
    dirty: boolean;
}

class MacroTable extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false, macroType: 'Carb', mealType: 1, meals: [], dirty: false
        };
    }

    public componentDidMount() {
        this.setState({
            meals: this.props.meals, macroType: this.props.macroType
        });
    }

    handleMealDescChange = (field: any, value: any) => {
        this.state.meals[parseInt(value['className'])]['mealDesc'] = value['value'];
        this.setState({ meals: this.state.meals, updated: true });
    }

    handleMacroChange = (field: any, value: any) => {
        //if (parseFloat(value['value']) === 0 || isNaN(parseFloat(value['value']))) {
        //    this.state.meals[parseInt(value['className'])]['macro'] = 0.0;
        //}
        //else {
        //    const re = /^[-+,0-9,\.]+$/;
        //    if (value['value'] === '' || re.test(value['value'])) {
        //        this.state.meals[parseInt(value['className'])]['macro'] = value['value'];
        //    }
        //}

        const re = /^[-+,0-9,\.]+$/;
        if (value['value'] === '' || re.test(value['value'])) {
            this.state.meals[parseInt(value['className'])]['macro'] = value['value'];
            this.setState({ meals: this.state.meals, updated: true });
        }
    }

    handleCheckChange = (field: any, value: any) => {
        console.log(value['checked']);
        this.state.meals[parseInt(value['className'])]['check'] = value['value'];
        this.setState({ meals: this.state.meals, updated: true });
    }

    getRows = () => {
        return (
            this.state.meals.map((item, index) =>
                <Grid.Row className={'row'} key={index} columns={3} stretched>
                    <Grid.Column className={'col_checkbox'} key={index} width={2} verticalAlign='middle' textAlign='center'>
                        <Checkbox className={index.toString()} checked={item.check} key={index} onChange={this.handleCheckChange} />
                    </Grid.Column>
                    <Grid.Column className={'col_desc'} key={index + 1} width={8}>
                        <Input className={index.toString()} key={index + 1} onChange={this.handleMealDescChange} value={item.mealDesc} placeholder='Meal Desc...' />
                    </Grid.Column>
                    <Grid.Column className={'col_macro'} key={index + 2} width={6}>
                        <Input className={index.toString()} key={index + 2} as='a' size='mini' onChange={this.handleMacroChange} value={item.macro} placeholder='Macro' />
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    addActivity = (event: any) => {
        this.state.meals.push({ mealDesc: '', macro: 0, check: false });
        this.setState({ updated: true });
    }

    removeActivities = (event: any) => {
        var arr = this.state.meals.filter(obj => obj.check === false);
        this.setState({ updated: true, meals: arr });
    }

    render() {

        if (this.state.macroType !== this.props.macroType ||
            this.state.mealType !== this.props.mealType)
        {
            this.setState({ meals: this.props.meals, macroType: this.props.macroType, mealType: this.props.mealType });
        }
        else if (this.props.update !== this.state.dirty) {
            this.setState({ meals: this.props.meals, macroType: this.props.macroType, mealType: this.props.mealType, dirty: this.props.update });
        }

        if (this.state.updated === true) {
            this.setState({ updated: false });
            this.props.updateMeals(this.state.meals, this.state.macroType);
        }

        var divLabelStyle5 = {
            color: '#0a0212',
            backgroundColor: 'White'
        };

        return (
            <Grid centered>
                <Grid.Column>
                    <Segment attached='top'>
                        <Grid centered>
                            <Grid.Row columns={3}>
                                <Grid.Column floated='left' width={4}>
                                    <Button size='tiny' color='black' fluid icon onClick={this.removeActivities}>
                                        <Icon name='minus' />
                                    </Button>
                                </Grid.Column>
                                <Grid.Column width={8} verticalAlign='middle'>
                                    <a style={divLabelStyle5}>Meals Details</a>
                                </Grid.Column>
                                <Grid.Column floated='right' width={4}>
                                    <Button size='tiny' color='black' fluid icon onClick={this.addActivity}>
                                        <Icon name='plus' />
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Segment textAlign='center' attached='bottom'>
                        <Grid centered>
                            <Grid.Row columns={3} textAlign='center'>
                                <Grid.Column width={2}>
                                </Grid.Column>
                                <Grid.Column width={8} textAlign='left'>
                                    <div><a>Description</a></div>
                                </Grid.Column>
                                <Grid.Column width={6} textAlign='left'>
                                    <div><a>Macro</a></div>
                                </Grid.Column>
                            </Grid.Row>
                            {this.getRows()}
                        </Grid>
                    </Segment>
                </Grid.Column>
            </Grid>);
    }
}

export default connect()(MacroTable);