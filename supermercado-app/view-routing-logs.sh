#!/bin/bash

# Script to view routing service logs

echo "🔍 Routing Services Log Viewer"
echo "================================="
echo

if [ ! -f "routing-services.log" ]; then
    echo "❌ No routing-services.log file found"
    echo "Make a request to the API to generate logs"
    exit 1
fi

case "${1:-tail}" in
    "tail")
        echo "📋 Showing last 20 log entries (live updates with Ctrl+C to exit):"
        echo "-------------------------------------------------------------------"
        tail -f -n 20 routing-services.log
        ;;
    "head")
        echo "📋 Showing first 20 log entries:"
        echo "-------------------------------------------------------------------"
        head -20 routing-services.log
        ;;
    "summary")
        echo "📊 Log Summary:"
        echo "-------------------------------------------------------------------"
        echo "Total entries: $(wc -l < routing-services.log)"
        echo "File size: $(du -h routing-services.log | cut -f1)"
        echo "Last updated: $(stat -c %y routing-services.log | cut -d. -f1)"
        echo
        echo "Service usage counts:"
        grep -o "✅ [A-Za-z ]*" routing-services.log | sort | uniq -c | sort -nr
        echo
        echo "Recent failures:"
        grep "❌" routing-services.log | tail -5
        ;;
    "clear")
        echo "🗑️  Clearing log file..."
        > routing-services.log
        echo "✅ Log file cleared"
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo "Commands:"
        echo "  tail     - Show last 20 entries and follow new ones (default)"
        echo "  head     - Show first 20 entries"
        echo "  summary  - Show log statistics and summary"
        echo "  clear    - Clear the log file"
        echo "  help     - Show this help message"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
