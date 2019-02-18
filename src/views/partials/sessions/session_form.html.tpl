<div class="container create-session-container">
    <div class="header">
        <h2 class="title">Create Session</h2>
    </div>
    <form class="form form-ajax add-session" action="/sessions" method="post">
        <div class="group left">
            <div class="field">
                <label class="label" for="session_name"><span>Name</span></label>
                <input type="text" class="name-field" name="session_name" placeholder="session name">
            </div>
            <div class="field">
                <label class="label" for="stations_num">Stations</label>
                <select class="stations-num-field" name="stations_num">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8" selected="selected">8</option>
                </select>
            </div>
            <div class="field">
                <label class="label" for="runs_num">Runs</label>
                <select class="runs-num-field" name="runs_num">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4" selected="selected">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                </select>
            </div>
            <p class="error-message"></p>
            <p class="success-message">New session added!</p>
        </div>
        <div class="group right">
            <div class="field">
                <label class="label" for="time_run">Run's time</label>
                <input type="text" class="time-run-field" name="time_run" pattern=".{1,3}" maxlength="3" placeholder="in minutes">
            </div>
            <div class="field">
                <label class="label" for="production_target">Target</label>
                <input type="text" class="production-target-field" name="production_target" pattern=".{1,3}" maxlength="3" placeholder="production per run">
            </div>
        </div>
        <input class="button button-blue button-submit" type="submit" value="Create Session">
    </form>
</div>
