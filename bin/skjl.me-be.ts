#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { SkjlMeBeStack } from '../lib/skjl.me-be-stack';

const app = new cdk.App();
new SkjlMeBeStack(app, 'SkjlMeBeStack');
