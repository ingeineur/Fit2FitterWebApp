import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Label, Icon, Card, Checkbox } from 'semantic-ui-react'
import './signin.css';

interface IProps {
    activities: IActivity[];
    guides: IActivityGuides;
    update: boolean;
    updateActivities: Function
}

interface IActivityGuides {
    calories: number;
    steps: number;
}

interface IActivity {
    calories: number;
    steps: number;
    maxHr: number;
    activityDesc: string;
    check: boolean;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
    dirty: boolean;
    activities: IActivity[];
}

class ActivityWorkoutTable extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false, dirty: false, activities: []
        };
    }

    public componentDidMount() {
        this.setState({
            activities: this.props.activities
        });
    }

    getColour = (total: number) => {
        if (total > 50.0 && total < 100) {
            return 'orange';
        }

        if (total === 100) {
            return 'teal';
        }

        if (total > 100.0) {
            return 'red';
        }

        return 'black';
    }

    handleActivityChange = (field: any, value: any) => {
        this.state.activities[parseInt(value['className'])]['activityDesc'] = value['value'];
        this.setState({ activities: this.state.activities, updated: true});
    }

    handleCaloriesChange = (field: any, value: any) => {
        if (parseInt(value['value']) === 0 || isNaN(parseInt(value['value']))) {
            this.state.activities[parseInt(value['className'])]['calories'] = 0;
        }
        else {
            this.state.activities[parseInt(value['className'])]['calories'] = parseInt(value['value']);
        }
        this.setState({ activities: this.state.activities, updated: true });
    }

    handleStepsChange = (field: any, value: any) => {
        if ((parseInt(value['value']) === 0) || isNaN(parseInt(value['value']))) {
            this.state.activities[parseInt(value['className'])]['steps'] = 0;
        }
        else {
            this.state.activities[parseInt(value['className'])]['steps'] = parseInt(value['value']);
        }
        this.setState({ activities: this.state.activities, updated: true });
    }

    handleMaxHrChange = (field: any, value: any) => {
        if ((parseInt(value['value']) === 0) || isNaN(parseInt(value['value']))) {
            this.state.activities[parseInt(value['className'])]['maxHr'] = 0;
        }
        else {
            this.state.activities[parseInt(value['className'])]['maxHr'] = parseInt(value['value']);
        }
        this.setState({ activities: this.state.activities, updated: true });
    }

    handleCheckChange = (field: any, value: any) => {
        this.state.activities[parseInt(value['className'])]['check'] = value['checked'];
        this.setState({ activities: this.state.activities, updated: true });
    }

    getRows = () => {
        var arr = this.state.activities.filter(x => x.activityDesc !== 'sleeps' && x.activityDesc !== 'steps');
        return (
            arr.map((item, index) =>
                <Grid.Row className={'row'} key={index} columns={4} stretched>
                    <Grid.Column className={'col_checkbox'} key={index} width={2} verticalAlign='middle' textAlign='center'>
                        <Checkbox className={(index + 2).toString()} checked={item.check} key={index} onChange={this.handleCheckChange} />
                    </Grid.Column>
                    <Grid.Column className={'col_desc'} key={index + 1} width={6}>
                        <Input className={(index + 2).toString()} key={index + 1} list='activities' onChange={this.handleActivityChange} value={item.activityDesc} placeholder='Choose Workout...' />
                        <datalist className={'datalist_desc'} key={index + 2} id='activities'>
                            <option key={index + 2} value='Jogging'>Jogging</option>
                            <option key={index + 3} value='Walking'>Walking</option>
                            <option key={index + 4} value='HIIT'>HIIT</option>
                            <option key={index + 5} value='HIIT Step'>HIIT Step</option>
                            <option key={index + 6} value='Mixed HIIT'>Mixed HIIT</option>
                            <option key={index + 7} value='HIIT Dance'>HIIT Dance</option>
                            <option key={index + 8} value='Body Pump'>Body Pump</option>
                            <option key={index + 9} value='Boxing Circuit'>Boxing Circuit</option>
                            <option key={index + 10} value='Boot Camp'>Boot Camp</option>
                            <option key={index + 11} value='MetaFit'>MetaFit</option>
                            <option key={index + 12} value='Pilates'>Pilates</option>
                            <option key={index + 13} value='Home Workout'>Home Workout</option>
                            <option key={index + 14} value='Weekly Challenge'>Weekly Challenge</option>
                        </datalist>
                    </Grid.Column>
                    <Grid.Column className={'col_calories'} key={index + 2} width={4}>
                        <Input className={(index + 2).toString()} key={index + 2} as='a' size='mini' onChange={this.handleCaloriesChange} value={item.calories} placeholder='Calories' />
                    </Grid.Column>
                    <Grid.Column className={'col_maxhr'} key={index + 4} as='a' width={4}>
                        <Input className={((index + 2)).toString()} key={index + 4} size='mini' onChange={this.handleMaxHrChange} value={item.maxHr} placeholder='MaxHr' />
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    render() {
        
        if (this.state.dirty !== this.props.update)
        {
            this.setState({ dirty: this.props.update, activities: this.props.activities });
        }

        if (this.state.updated === true) {
            this.setState({ updated: false });
            this.props.updateActivities(this.state.activities);
        }

        return (
            <Grid centered>
                <Grid.Row columns={4} textAlign='center'>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    <Grid.Column width={6} textAlign='left'>
                        <div><a className='text-table-row'>Workout Description</a></div>
                    </Grid.Column>
                    <Grid.Column width={4} textAlign='left'>
                        <div><a className='text-table-row'>Calories(kcal)</a></div>
                    </Grid.Column>
                    <Grid.Column width={4} textAlign='left'>
                        <div><a className='text-table-row'>Max Hr(bpm)</a></div>
                    </Grid.Column>
                </Grid.Row>
                {this.getRows()}
            </Grid>);
    }
}

export default connect()(ActivityWorkoutTable);