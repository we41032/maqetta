define([
	"dojo/_base/declare",
	"davinci/ve/tools/CreateTool",
	"davinci/ve/commands/ModifyCommand" /*,
	"davinci/ve/widget",
	"davinci/commands/CompoundCommand",
	"davinci/ve/commands/AddCommand",
	"davinci/ve/commands/MoveCommand",
	"davinci/ve/commands/ResizeCommand" */
], function(
	declare,
	CreateTool /*,
	Widget,
	CompoundCommand,
	AddCommand,
	MoveCommand,
	ResizeCommand*/
) {

return declare(CreateTool, {
	
	// In nearly all cases, mouseUp completes the create operation.
	// But for certain widgets such as Shapes.line, we allow multi-segment
	// lines to be created via multiple [mousedown/]mouseup gestures,
	// in which case this property will be false.
	exitCreateToolOnMouseUp:false,
	
	// For cases where mouseUp doesn't complete the create operation,
	// increment this counter with each mouseUp
	mouseUpCounter:0,

	constructor: function(data){
//debugger;
	},
	
	onMouseDown: function(event){
//console.log('LineCreateTool.js onMouseDown');
		this._line_md_x = event.pageX;
		this._line_md_y = event.pageY;
		this.inherited(arguments);
	},
	
	onMouseMove: function(event){
//console.log('LineCreateTool.js onMouseMove');
		this.inherited(arguments);
	},
	
	onMouseUp: function(event){
console.log('LineCreateTool.js onMouseUp. this._widget='+this._widget+',this._mdPosition='+this._mdPosition);
		this._line_mu_x = event.pageX;
		this._line_mu_y = event.pageY;
		this.inherited(arguments);
//experiment
//var dijitWidget = this._widget.dijitWidget;
//dijitWidget._points = [{x:0,y:0},{x:100,y:100},{x:200,y:0}];
		this.mouseUpCounter++;
	},
	
	/**
	 * Returns true if CreateTool.js should create a new widget as part of
	 * the current create operation, false if just add onto existing widget.
	 * For this tool (line tool), only create a new widget with first mouseUp.
	 */
	createNewWidget: function(){
		return (this.mouseUpCounter === 0);
	},
	
	addToCommandStack: function(command, params){
		// Modify points value if this is a subsequent mouseUp operation
		// or if this is first mouseUp and there was a preceding mouseDown
		if(this.mouseUpCounter > 0 || typeof this._line_md_x == 'number'){
			if(this.mouseUpCounter === 0){
				if(typeof this._line_md_x == 'number'){
					this._line_orig_x = this._line_md_x;
					this._line_orig_y = this._line_md_y;
				}else{
					this._line_orig_x = this._line_mu_x;
					this._line_orig_y = this._line_mu_y;
				}
			}
			var widget = params.widget;
			var properties = {};
			var points;
			var diff_x = this._line_mu_x - this._line_md_x;
			var diff_y = this._line_mu_y - this._line_md_y;
			if(this.mouseUpCounter === 0){
				if(diff_x !== 0 || diff_y !== 0){
					points = '0,0,'+diff_x+','+diff_y;
				}else{
					points = '0,0,0,0';
				}
			}else{
				points = '';
				this._widget.dijitWidget._points.forEach(function(pt){
					points += pt.x + ',' + pt.y + ',';
				});
				var adj_md_x = this._line_md_x - this._line_orig_x;
				var adj_md_y = this._line_md_y - this._line_orig_y;
				var adj_mu_x = this._line_mu_x - this._line_orig_x;
				var adj_mu_y = this._line_mu_y - this._line_orig_y;
				if(diff_x !== 0 || diff_y !== 0){
					points += adj_md_x + ',' + adj_md_y + ',' + adj_mu_x + ',' + adj_mu_y;
				}else{
					points += adj_mu_x + ',' + adj_mu_y;
				}
			}
			properties.points = points;
			command.add(new davinci.ve.commands.ModifyCommand(widget, properties));
		}
	}

});

});