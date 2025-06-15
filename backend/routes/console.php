<?php

Schedule::command('telescope:prune')->daily();

Schedule::command('backup:run --only-db')->weekly();
