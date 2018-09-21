import React, { Fragment } from 'react';
import { Table } from 'semantic-ui-react';



const DownArrow = () =>
{
    return(
        <svg height="8" width="8" style={{marginLeft: ".4rem"}}>
            <polygon points="0,0 8,0 4,8" 
                style={{fill:"rgb(33,33,33)"}} />
        </svg>
    );
}

const UpArrow = () =>
{
    return(
        <svg height="8" width="8" style={{marginLeft: ".4rem"}}>
            <polygon points="0,8 8,8 4,0" 
                style={{fill:"rgb(33,33,33)"}} />
        </svg>
    );
}

const DataHeader = props => {

    let arrow = <Fragment/>;

    if(props.filter === props.currentFilter)
    {
        if(props.direction === -1)
        {
            arrow = <DownArrow/>;
        }
        else if(props.direction === 1)
        {
            arrow = <UpArrow/>
        }
    }

	return(
        <Table.HeaderCell onClick = {()=>{props.setFilter(props.filter)}}>
            {props.children}
            {arrow}
        </Table.HeaderCell>
	);
}

const _default = DataHeader;
export { _default as default };