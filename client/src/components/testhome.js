import React, { useEffect, useState } from "react";
import GridLayout from 'react-grid-layout';
import { Container, Grid, Divider, Header, Icon } from 'semantic-ui-react';
import Box from '@material-ui/core/Box';

export default function RecursiveTreeView() {

	useEffect(() => {

	}, []);


	return (
		<div>
			<Grid relaxed>
				<Grid.Row>
					<Grid.Column width={4} floated='left'>
						<Box bgcolor="darkblue" color="white" fontWeight="bold" fontSize="auto" >
							<p>TITLE GOES HERE</p>
						</Box>
					</Grid.Column>

					<Grid.Column width={12} floated='right'>
						<Box bgcolor="lightblue" >
							<p>stupid</p>
						</Box>
					</Grid.Column>

				</Grid.Row>


			</Grid>

		</div>
	);
}
