import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Menu } from 'semantic-ui-react'
import MacroTable from './MacroTable'

interface IProps {
    meal: IMeal,
    guides: IMacroGuides,
    updateParentCarb: Function,
    update: boolean;
}

interface IMeal {
    carb: IMealDetails[];
    protein: IMealDetails[];
    fat: IMealDetails[];
    fruits: IMealDetails[];
    type: number;
}

interface IMealDetails {
    macro: number;
    mealDesc: string;
    check: boolean;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface IState {
    activeItem: string;
    username: string;
    password: string;
    carb: IMealDetails[];
    protein: IMealDetails[];
    fat: IMealDetails[];
    veg: IMealDetails[];
    type: number;
    update: boolean;
    updated: boolean;
    dirty: boolean;
}

class MacroNew extends React.Component<IProps, IState> {

    updateMeals = (meals: IMealDetails[], type: string) => {
        if (type === 'Carb') {
            this.setState({ update: true, carb: meals });
            return;
        }

        if (type == 'Protein') {
            this.setState({ update: true, protein: meals });
            return;
        }

        if (type == 'Fat') {
            this.setState({ update: true, fat: meals });
            return;
        }

        this.setState({ update: true, veg: meals });
    }

    constructor(props: IProps) {
        super(props);
        this.updateMeals = this.updateMeals.bind(this);
        this.state = {
            activeItem: 'Carb', username: '', password: '', carb: [], protein: [], fat: [], veg: [], type: 1, update: false,
            dirty: false, updated: false
        };
    }

    public componentDidMount() {
        this.setState({ carb: this.props.meal.carb, protein: this.props.meal.protein, fat: this.props.meal.fat, veg: this.props.meal.fruits, type: this.props.meal.type });
    }

    handleItemClick = (e: any, { name }: any) => {
        this.setState({ activeItem: name })
    }

    getMacroType = () => {
        if (this.state.activeItem == 'Carb') {
            return 1;
        }
        if (this.state.activeItem == 'Protein') {
            return 2;
        }
        if (this.state.activeItem == 'Fat') {
            return 3;
        }

        return 4;
    }

    getMeals = () => {
        if (this.state.activeItem == 'Carb') {
            return this.state.carb;
        }
        if (this.state.activeItem == 'Protein') {
            return this.state.protein;
        }
        if (this.state.activeItem == 'Fat') {
            return this.state.fat;
        }

        return this.state.veg;
    }

    render() {
        const activeItem = this.state.activeItem;

        if (this.state.type !== this.props.meal.type ) {
            this.setState({ carb: this.props.meal.carb, protein: this.props.meal.protein, fat: this.props.meal.fat, type: this.props.meal.type, veg: this.props.meal.fruits});
        }
        else if (this.props.update !== this.state.dirty) {
            this.setState({ updated: !this.state.updated })
            this.setState({ carb: this.props.meal.carb, protein: this.props.meal.protein, fat: this.props.meal.fat, type: this.props.meal.type, veg: this.props.meal.fruits, dirty: this.props.update });
        }

        if (this.state.update === true) {
            this.setState({ update: false });
            this.props.updateParentCarb(this.state.type - 1, this.state.carb, this.state.protein, this.state.fat, this.state.veg);
        }
        
        return (
            <Grid>
                <Grid.Column stretched width={3}>
                    <Menu color='pink' fluid vertical text >
                        <Menu.Item
                            name='Carb'
                            active={activeItem === 'Carb'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Protein'
                            active={activeItem === 'Protein'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Fat'
                            active={activeItem === 'Fat'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Veg/Fruits'
                            active={activeItem === 'Veg/Fruits'}
                            onClick={this.handleItemClick}
                        />
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={13}>
                    <MacroTable update={this.state.updated} meals={this.getMeals()} updateMeals={this.updateMeals} macroType={this.state.activeItem} mealType={this.state.type} />
                </Grid.Column>
            </Grid>);
    }
}

export default connect()(MacroNew);