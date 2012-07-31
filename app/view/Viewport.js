/*
 * File: app/view/Viewport.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('SimpleTasks.view.Viewport', {
    extend: 'SimpleTasks.view.SimpleTasksViewport',
    renderTo: Ext.getBody(),
    requires: [
        'SimpleTasks.view.MyComponent3',
        'SimpleTasks.view.SimpleTasksViewport',
        'SimpleTasks.view.lists.ContextMenu',
        'SimpleTasks.view.tasks.ContextMenu',
        'SimpleTasks.view.tasks.DefaultTimeWindow',
        'SimpleTasks.view.tasks.EditWindow',
        'SimpleTasks.view.tasks.Form',
        'SimpleTasks.view.tasks.ReminderWindow'
    ]
});