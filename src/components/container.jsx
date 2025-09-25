import React from "react";
import {
  Heading,
  Flex
} from '@chakra-ui/react';
import Kaleidoscope from './kaleidoscope';
import ProphecyGenerator from './ProphecyGenerator';

export default function Container() {

    return (
        <Flex bg="pink.300" w="100vw" minH="100vh" direction="column">
            <Flex direction="column" alignItems="center" width="100%" pt={50} pb={50}>
                <Heading fontFamily="Honk" fontSize="80px" pb={50}>Boto Wheel</Heading>
                <Kaleidoscope />
            </Flex>
            <Flex justify="center" pb={50}>
                <ProphecyGenerator />
            </Flex>
        </Flex>
    )
}